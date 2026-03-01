import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import socket from "../../sockets";
import VideoRoom from "./VideoRoom";
import CodeEditor from "../Code/CodeEditor";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MeetingEndedModal from "./MeetingEndedModal";
import axios from "../../utils/axios";

export default function Interviewee() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [codeEditorOpen, setCodeEditorOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [interviewerEmail, setInterviewerEmail] = useState("");

  // Fetch room details to get interviewer email
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/interview/room/${roomId}`);
        if (response.data.room && response.data.room.interviewerId) {
          setInterviewerEmail(response.data.room.interviewerId.email);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // Listen for chat messages even when chat is closed
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-chat-room", roomId);

    const handleChat = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      
      // Increment unread count if chat is not open
      if (!chatOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    const handleMeetingEnded = () => {
      setMeetingEnded(true);
    };

    socket.on("chat", handleChat);
    socket.on("meeting-ended", handleMeetingEnded);

    return () => {
      socket.off("chat", handleChat);
      socket.off("meeting-ended", handleMeetingEnded);
    };
  }, [roomId, chatOpen]);

  // Clear unread count when chat opens
  useEffect(() => {
    if (chatOpen) {
      setUnreadCount(0);
    }
  }, [chatOpen]);

  const handleLeaveInterview = () => {
    socket.emit("leave-video-room", roomId);
    socket.emit("leave-chat-room", roomId);
    navigate("/dashboard");
  };

  if (!roomId) return <Navigate to="/" />;

  return (
    <div className="relative flex h-screen text-white overflow-hidden bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.18),transparent_40%),linear-gradient(180deg,#0a0a0f, #050507)]">
      
      {/* Main Grid Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        
        {/* Video Section - Left / Top */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <VideoRoom
            socket={socket}
            roomId={roomId}
            role="interviewee"
            chatOpen={chatOpen}
            onOpenChat={() => setChatOpen(true)}
            unreadCount={unreadCount}
          />
        </div>

        {/* Right Panel - Code Editor & Chat */}
        <div className="w-full md:w-2/5 lg:w-1/2 flex flex-col gap-4 min-h-0">
          
          {/* Code Editor */}
          {codeEditorOpen && (
            <div className="flex-1 min-h-0 flex flex-col">
              <CodeEditor socket={socket} roomId={roomId} role="interviewee" />
            </div>
          )}

          {/* Toggle Code Editor Button */}
          {!codeEditorOpen && (
            <button
              onClick={() => setCodeEditorOpen(true)}
              className="px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-sm font-semibold text-indigo-300 transition flex items-center justify-center gap-2"
            >
              <ChevronRight size={16} /> Show Code Editor
            </button>
          )}

          {/* Chat Room */}
          {chatOpen && (
            <div className="flex-1 min-h-0 flex flex-col">
              <ChatRoom
                socket={socket}
                roomId={roomId}
                role="interviewee"
                onClose={() => setChatOpen(false)}
                messages={chatMessages}
                setMessages={setChatMessages}
              />
            </div>
          )}

          {/* Toggle Chat Button */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-sm font-semibold text-indigo-300 transition flex items-center justify-center gap-2"
            >
              <ChevronRight size={16} /> Show Chat
            </button>
          )}

          {/* Collapse Code Editor */}
          {codeEditorOpen && (
            <button
              onClick={() => setCodeEditorOpen(false)}
              className="h-8 px-3 text-xs text-gray-500 hover:text-gray-400 hover:bg-white/5 rounded-lg transition flex items-center justify-center gap-1"
              title="Collapse code editor"
            >
              <ChevronLeft size={14} /> Collapse
            </button>
          )}
        </div>
      </div>

      {/* Meeting Ended Modal */}
      <MeetingEndedModal
        isOpen={meetingEnded}
        onLeave={handleLeaveInterview}
        role="interviewee"
        otherUserEmail={interviewerEmail}
      />
    </div>
  );
}
