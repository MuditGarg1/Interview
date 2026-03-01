import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhoneSlash, FaCopy } from "react-icons/fa";
import useVideoRoom from "./useVideoRoom";
import { useState } from "react";

export default function VideoRoom({ socket, roomId, role, chatOpen, onOpenChat, unreadCount = 0 }) {
  const {
    localRef,
    remoteRef,
    micOn,
    camOn,
    toggleMic,
    toggleCam,
    toggleScreen,
    endMeeting,
  } = useVideoRoom(socket, roomId, role);

  const [copiedId, setCopiedId] = useState(false);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const roleLabel =
    role === "interviewer"
      ? "Interviewer"
      : role === "interviewee"
        ? "Interviewee"
        : "Participant";

  return (
    <section className="flex flex-col h-full min-h-0 p-4 gap-4 flex-1">
      {/* Header */}
      <header className="flex items-center justify-between rounded-2xl px-4 py-3 border border-indigo-500/20 bg-linear-to-r from-slate-900/70 via-slate-900/30 to-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold">Meeting ID</span>
          <span className="font-mono text-[12px] bg-slate-800/60 border border-indigo-500/20 px-3 py-1 rounded-lg">
            {roomId.slice(0, 8)}...
          </span>
          <button
            onClick={copyRoomId}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition font-medium ${
              copiedId
                ? "bg-green-600/30 border border-green-500/30 text-green-300"
                : "bg-slate-800/50 border border-indigo-500/20 hover:bg-slate-700/50 text-gray-300"
            }`}
            title="Copy meeting ID"
          >
            <FaCopy size={12} /> {copiedId ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {!chatOpen && onOpenChat && (
            <button
              onClick={onOpenChat}
              className="relative rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-[11px] uppercase tracking-widest font-semibold text-indigo-300 hover:bg-indigo-600/30 transition"
            >
              💬 Open Chat
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          )}

          <div className="text-[11px] text-gray-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg bg-slate-800/50 font-medium">
            Your Role: <span className="text-indigo-300 font-semibold">{roleLabel}</span>
          </div>
        </div>
      </header>

      {/* Video Section */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">
        {/* Video Grid */}
        <div className="grid grid-cols-2 gap-4 h-full min-h-0">
          {/* Local Video */}
          <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-linear-to-br from-slate-900/70 to-black/80 shadow-2xl">
            <video ref={localRef} autoPlay muted className="h-full w-full object-cover" />
            <div className="absolute left-3 top-3 text-xs uppercase tracking-widest bg-black/60 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-lg font-semibold">
              📹 {roleLabel}
            </div>
            {!camOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur">
                <FaVideoSlash size={32} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-linear-to-br from-slate-900/70 to-black/80 shadow-2xl">
            <video ref={remoteRef} autoPlay className="h-full w-full object-cover" />
            <div className="absolute left-3 top-3 text-xs uppercase tracking-widest bg-black/60 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-lg font-semibold">
              📹 {roleLabel === "Interviewer" ? "Interviewee" : "Interviewer"}
            </div>
          </div>
        </div>

        {/* Controls Footer */}
        <footer className="flex justify-center gap-4 pb-2">
          <button 
            className={`p-3 rounded-full transition font-bold flex items-center justify-center ${
              micOn
                ? "bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                : "bg-red-600/80 hover:bg-red-600"
            }`}
            onClick={toggleMic}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
          </button>

          <button 
            className={`p-3 rounded-full transition font-bold flex items-center justify-center ${
              camOn
                ? "bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                : "bg-red-600/80 hover:bg-red-600"
            }`}
            onClick={toggleCam}
            title={camOn ? "Turn off camera" : "Turn on camera"}
          >
            {camOn ? <FaVideo size={18} /> : <FaVideoSlash size={18} />}
          </button>

          <button 
            className="p-3 rounded-full bg-slate-700/60 hover:bg-slate-600/80 transition font-bold flex items-center justify-center text-gray-100"
            onClick={toggleScreen}
            title="Share screen"
          >
            <FaDesktop size={18} />
          </button>

          <button 
            className="p-3 rounded-full bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition font-bold flex items-center justify-center"
            onClick={endMeeting}
            title="End meeting"
          >
            <FaPhoneSlash size={18} />
          </button>
        </footer>
      </div>
    </section>
  );
}
