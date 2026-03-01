import { useNavigate } from "react-router-dom";
import { Bot, Users, ArrowRight } from "lucide-react";

export default function Interview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Your Interview. Your Way.
        </h1>
        <p className="text-gray-300 text-lg mb-14 max-w-2xl mx-auto">
          Choose how you want to prepare — connect with real interviewers or
          practice anytime with AI-powered mock interviews.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Real Interview */}
          <div
            onClick={() => navigate("/interview-entry")}
            className="p-8 rounded-2xl border border-gray-800 bg-linear-to-b from-[#0B1220] to-[#070B14]
            group cursor-pointer shadow-lg hover:shadow-2xl transition duration-300
            hover:border-indigo-500/60 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-indigo-500/10" />

            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mx-auto mb-6">
              <Users className="w-7 h-7 text-indigo-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-200 mb-3">
              Real Interview
            </h2>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Experience real interview scenarios with industry professionals
              and get actionable feedback.
            </p>

            <span className="inline-flex items-center gap-2 font-semibold text-indigo-400 group-hover:text-indigo-300 transition">
              Start Real Interview <ArrowRight className="w-5 h-5" />
            </span>
          </div>

          {/* AI Interview */}
          <div
            onClick={() => navigate("/ai-interview")}
            className="p-8 rounded-2xl border border-gray-800 bg-linear-to-b from-[#0B1220] to-[#070B14]
            group cursor-pointer shadow-lg hover:shadow-2xl transition duration-300
            hover:border-indigo-500/60 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-indigo-500/10" />

            <span className="absolute top-4 right-4 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
              Recommended
            </span>

            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mx-auto mb-6">
              <Bot className="w-7 h-7 text-indigo-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-200 mb-3">
              AI Interview
            </h2>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Practice unlimited mock interviews with AI — available 24/7 and
              tailored to your role.
            </p>

            <span className="inline-flex items-center gap-2 font-semibold text-indigo-400 group-hover:text-indigo-300 transition">
              Start AI Interview <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
