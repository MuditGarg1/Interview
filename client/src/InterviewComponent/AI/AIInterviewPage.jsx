import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AIInterviewPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const resumeText = state?.resumeText || "";
  const role = state?.role || "";

  useEffect(() => {
    if (!resumeText || !role) {
      navigate("/ai-interview", { replace: true });
    }
  }, [navigate, resumeText, role]);

  if (!resumeText || !role) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-white">AI Interview</h1>
        <p className="text-zinc-400 mt-2">
          Resume uploaded successfully. Role:{" "}
          <span className="text-zinc-200 font-medium capitalize">{role}</span>
        </p>

        <div className="mt-6">
          <h2 className="text-lg text-white font-medium mb-2">Parsed Resume</h2>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-h-[50vh] overflow-auto whitespace-pre-wrap text-sm text-zinc-300">
            {resumeText.trim() || "No text extracted from resume."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewPage;
