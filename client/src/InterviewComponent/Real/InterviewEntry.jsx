import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiVideo, FiUsers } from "react-icons/fi";
import api from "../../utils/axios";

export default function InterviewEntry() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // "interviewer" | "interviewee"
  const [meetingId, setMeetingId] = useState(""); // interviewee only
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Reset form when switching modes
  useEffect(() => {
    setMeetingId("");
    setPassword("");
    setError("");
  }, [mode]);

  const startInterview = async () => {
    try {
      /* ======================
         INTERVIEWER FLOW
         ====================== */
      if (mode === "interviewer") {
        if (!password) {
          setError("Please set a meeting password to continue.");
          return;
        }

        setError("");

        const { data } = await api.post("/interview/create", { password });

        // ✅ IMMEDIATE NAVIGATION (single click)
        navigate(`/real/host/${data.roomId}`);
        return;
      }

      /* ======================
         INTERVIEWEE FLOW
         ====================== */
      if (mode === "interviewee") {
        if (!meetingId || !password) {
          setError("Meeting ID and password are required.");
          return;
        }

        setError("");

        const { data } = await api.post("/interview/join", {
          roomId: meetingId,
          password,
        });

        navigate(`/real/client/${meetingId}`);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen text-white px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div className="animate-fadeIn">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            A Better Way to Conduct Interviews
          </h1>

          <p className="text-gray-400 text-lg mb-10">
            Secure, distraction-free interview sessions designed for real
            conversations and accurate evaluations.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <FiVideo className="text-indigo-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Live Interview Sessions</h3>
                <p className="text-gray-400 text-sm">
                  High-quality real-time interview experience for interviewers and
                  interviewees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiLock className="text-indigo-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Secure Access</h3>
                <p className="text-gray-400 text-sm">
                  Password-protected meetings ensure only invited users can
                  join.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiUsers className="text-indigo-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold">Role-Based Entry</h3>
                <p className="text-gray-400 text-sm">
                  Interviewers control the interview. Interviewees join with credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="animate-slideUp">
          <div className="rounded-2xl border border-gray-800 p-10 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-2">Get Started</h2>
            <p className="text-gray-400 mb-8 text-sm">
              Choose how you want to enter the interview session
            </p>

            {/* MODE SELECT */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setMode("interviewer")}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all
                  ${
                    mode === "interviewer"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-gray-700 hover:border-indigo-500"
                  }`}
              >
                Take Interview
              </button>

              <button
                onClick={() => setMode("interviewee")}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all
                  ${
                    mode === "interviewee"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-gray-700 hover:border-indigo-500"
                  }`}
              >
                Join Interview
              </button>
            </div>

            {mode && (
              <div className="space-y-4">
                {/* INTERVIEWEE MEETING ID */}
                {mode === "interviewee" && (
                  <input
                    type="text"
                    placeholder="Meeting ID"
                    value={meetingId}
                    onChange={(e) => {
                      setMeetingId(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-700 focus:border-indigo-500 outline-none"
                  />
                )}

                {/* PASSWORD */}
                <input
                  type="password"
                  placeholder="Meeting Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-gray-700 focus:border-indigo-500 outline-none"
                />

                {/* ERROR */}
                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                {/* ACTION BUTTON */}
                <button
                  onClick={startInterview}
                  className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600
                  hover:from-indigo-600 hover:to-indigo-700 transition-all font-semibold tracking-wide shadow-lg shadow-indigo-500/30"
                >
                  {mode === "interviewer" ? "Start Interview →" : "Join Interview →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .animate-slideUp {
            animation: slideUp 0.6s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

