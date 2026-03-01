import { useEffect, useMemo, useRef, useState } from "react";
import { FaPaperPlane, FaTimes, FaCircle } from "react-icons/fa";

export default function ChatRoom({
  socket,
  roomId,
  role,
  onClose,
  messages,
  setMessages,
}) {
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(true);
  const typingTimeoutRef = useRef(null);

  const displayRole = useMemo(() => {
    if (role === "interviewer") return "Interviewer";
    if (role === "interviewee") return "Interviewee";
    return "Guest";
  }, [role]);

  useEffect(() => {
    socket.emit("join-chat-room", roomId);

    const handleMeetingEnded = () => {
      alert("Meeting ended");
    };

    socket.on("meeting-ended", handleMeetingEnded);

    return () => {
      socket.off("meeting-ended", handleMeetingEnded);
    };
  }, [roomId, socket]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !autoScrollRef.current) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    autoScrollRef.current = nearBottom;
  };

  const send = () => {
    if (!msg.trim()) return;

    const payload = {
      roomId,
      msg,
      sender: displayRole,
      ts: new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      }),
    };

    socket.emit("chat", payload);
    setMessages(p => [...p, payload]);
    setMsg("");
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
    }
    
    // Clear timeout and reset typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <aside className="h-full w-full flex flex-col rounded-2xl border border-indigo-500/20 bg-linear-to-b from-slate-900/50 to-black/60 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-indigo-500/20 flex items-center justify-between bg-linear-to-r from-slate-900/80 to-black/50">
        <div className="flex items-center gap-2">
          <FaCircle className="text-green-400 text-[6px]" />
          <span className="font-semibold text-sm tracking-wide text-white">
            Live Chat
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-red-500/20 transition text-gray-400 hover:text-red-400"
            title="Close chat"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const self = m.sender === displayRole;

            return (
              <div
                key={i}
                className={`flex ${self ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm border shadow-md ${
                    self
                      ? "bg-linear-to-r from-indigo-600/80 to-indigo-500/60 border-indigo-400/30"
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}
                >
                  <div className={`text-[10px] opacity-60 mb-1 uppercase tracking-wider ${
                    self ? "text-indigo-200" : "text-gray-300"
                  }`}>
                    {m.sender}
                  </div>
                  <div className="wrap-break-word leading-relaxed text-white">
                    {m.msg}
                  </div>
                  <div className={`text-[9px] opacity-50 mt-1 text-right ${
                    self ? "text-indigo-100" : "text-gray-400"
                  }`}>
                    {m.ts}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-indigo-500/20 bg-linear-to-r from-slate-900/50 to-black/50 backdrop-blur">
        <div className="flex items-center gap-2 bg-slate-800/40 rounded-xl px-3 border border-slate-700/50 hover:border-indigo-500/30 transition">
          <input
            value={msg}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm px-1 py-3 outline-none placeholder:text-gray-500 text-white"
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
          />

          <button
            onClick={send}
            disabled={!msg.trim()}
            className="p-2 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Send message"
          >
            <FaPaperPlane size={14} className="text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
}
