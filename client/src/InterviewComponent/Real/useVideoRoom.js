import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import {
  createPeerConnection,
  addLocalTracks,
  createOffer,
  handleOffer,
  handleAnswer,
  addIce,
  replaceVideoTrack,
  replaceCameraTrack,
} from "../../utils/webrtc";

const toRoleKey = role => {
  if (role === "interviewer") return "host";
  if (role === "interviewee") return "client";
  return role;
};

export default function useVideoRoom(socket, roomId, role) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const shouldCreateOfferRef = useRef(false);
  const pendingOfferRef = useRef(null);

  const [micOn, setMicOn] = useState(() => {
    const v = localStorage.getItem("micOn");
    return v === null ? true : v === "true";
  });

  const [camOn, setCamOn] = useState(() => {
    const v = localStorage.getItem("camOn");
    return v === null ? true : v === "true";
  });

  const [sharing, setSharing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("micOn", micOn);
  }, [micOn]);

  useEffect(() => {
    localStorage.setItem("camOn", camOn);
  }, [camOn]);

  const cleanupMeeting = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
  };

  const endMeeting = () => {
    const roleKey = toRoleKey(role);

    // Emit meeting-ended event so modals can show
    socket.emit("meeting-ended", roomId);

    if (roleKey === "host") {
      socket.emit("host-end-room", roomId);
      cleanupMeeting();
      // Don't navigate here - let the modal handle it
    } else {
      socket.emit("leave-video-room", roomId);
      socket.emit("leave-chat-room", roomId);
      cleanupMeeting();
      // Don't navigate here - let the modal handle it
    }
  };

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    blockBack();

    const handlePopState = () => {
      const ok = window.confirm("Do you want to leave the meeting?");
      if (ok) {
        endMeeting();
      } else {
        blockBack();
      }
    };

    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const roleKey = toRoleKey(role);

      try {
        await api.post("/interview/verify", { roomId, role: roleKey });
      } catch (err) {
        navigate("/", { replace: true });
        return;
      }

      if (!active) return;

      socket.emit("join-video-room", { roomId, role: roleKey });

      const pc = createPeerConnection(
        socket,
        roomId,
        s => (remoteRef.current.srcObject = s)
      );

      pcRef.current = pc;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      localRef.current.srcObject = stream;

      stream.getAudioTracks().forEach(t => (t.enabled = micOn));
      stream.getVideoTracks().forEach(t => (t.enabled = camOn));

      addLocalTracks(pc, stream);

      if (roleKey === "host" && shouldCreateOfferRef.current) {
        shouldCreateOfferRef.current = false;
        createOffer(pcRef.current, socket, roomId);
      }

      if (pendingOfferRef.current) {
        handleOffer(pcRef.current, pendingOfferRef.current, socket, roomId);
        pendingOfferRef.current = null;
      }
    };

    init();

    const onOffer = o => {
      if (toRoleKey(role) !== "client") return;

      if (!localStreamRef.current) {
        pendingOfferRef.current = o;
        return;
      }

      handleOffer(pcRef.current, o, socket, roomId);
    };

    const onAnswer = a => pcRef.current && handleAnswer(pcRef.current, a);
    const onIce = c => pcRef.current && addIce(pcRef.current, c);

    const onPeerJoined = () => {
      if (toRoleKey(role) === "host") {
        createOffer(pcRef.current, socket, roomId);
      }
    };

    const onMeetingEnded = () => {
      cleanupMeeting();
      // Don't navigate - let the Host/Client components handle navigation
    };

    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice", onIce);
    socket.on("peer-joined", onPeerJoined);

    socket.on("meeting-ended", onMeetingEnded);

    return () => {
      active = false;

      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice", onIce);
      socket.off("peer-joined", onPeerJoined);
      socket.off("meeting-ended", onMeetingEnded);

      cleanupMeeting();
    };
  }, [roomId, role, socket, navigate, micOn, camOn]);

  const toggleMic = () => {
    const s = localStreamRef.current;
    if (!s) return;

    s.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    const enabled = s.getAudioTracks().some(t => t.enabled);
    setMicOn(enabled);
  };

  const toggleCam = () => {
    const s = localStreamRef.current;
    if (!s) return;

    s.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    const enabled = s.getVideoTracks().some(t => t.enabled);
    setCamOn(enabled);
  };

  const toggleScreen = async () => {
    if (!pcRef.current) return;

    if (!sharing) {
      await replaceVideoTrack(pcRef.current);
      setSharing(true);
    } else {
      await replaceCameraTrack(pcRef.current);
      setSharing(false);
    }
  };

  return {
    localRef,remoteRef,micOn,camOn,sharing,
    toggleMic,toggleCam,toggleScreen,endMeeting,
  };
}
