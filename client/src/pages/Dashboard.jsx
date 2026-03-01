import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { Star, ChevronLeft } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("given"); // "given" or "received"
  const [feedbackGiven, setFeedbackGiven] = useState([]);
  const [feedbackReceived, setFeedbackReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const [givenRes, receivedRes] = await Promise.all([
        axios.get("/interview/feedback/given"),
        axios.get("/interview/feedback/received"),
      ]);

      setFeedbackGiven(givenRes.data.feedbacks || []);
      setFeedbackReceived(receivedRes.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (score) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400 font-bold">{score.toFixed(1)}</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.round(score)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              }
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Interview Feedback</h1>
          <p className="text-gray-400">Manage your interview experiences and feedback</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab("given")}
            className={`pb-4 font-semibold text-lg transition-all ${
              activeTab === "given"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Interviews Conducted ({feedbackGiven.length})
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`pb-4 font-semibold text-lg transition-all ${
              activeTab === "received"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Interviews Attended ({feedbackReceived.length})
          </button>
        </div>

        {/* Feedback List */}
        {selectedFeedback ? (
          <FeedbackDetailView
            feedback={selectedFeedback}
            onBack={() => setSelectedFeedback(null)}
            isGiven={activeTab === "given"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "given" ? (
              feedbackGiven.length > 0 ? (
                feedbackGiven.map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                    renderStarRating={renderStarRating}
                    isGiven={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-400 text-lg">No interviews conducted yet</p>
                </div>
              )
            ) : feedbackReceived.length > 0 ? (
              feedbackReceived.map((feedback) => (
                <FeedbackCard
                  key={feedback._id}
                  feedback={feedback}
                  onClick={() => setSelectedFeedback(feedback)}
                  renderStarRating={renderStarRating}
                  isGiven={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 text-lg">No interviews attended yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackCard({
  feedback,
  onClick,
  renderStarRating,
  isGiven,
}) {
  const person = isGiven ? feedback.intervieweeId : feedback.interviewerId;
  const date = new Date(feedback.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const getHiringDecisionColor = (decision) => {
    const colors = {
      strong_hire: "bg-green-600/20 border-green-500/50 text-green-300",
      hire: "bg-blue-600/20 border-blue-500/50 text-blue-300",
      hold: "bg-yellow-600/20 border-yellow-500/50 text-yellow-300",
      no_hire: "bg-red-600/20 border-red-500/50 text-red-300",
    };
    return colors[decision] || "bg-gray-600/20 border-gray-500/50 text-gray-300";
  };

  const getHiringDecisionLabel = (decision) => {
    const labels = {
      strong_hire: "🚀 Strong Hire",
      hire: "✅ Hire",
      hold: "⏳ On Hold",
      no_hire: "❌ No Hire",
    };
    return labels[decision] || "Unknown";
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-6 cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-700/40">
        <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-300 transition">{person?.name}</h3>
        <p className="text-sm text-gray-400">{person?.email}</p>
        <p className="text-xs text-gray-500 mt-2">Feedback on {date}</p>
      </div>

      {/* Scores */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Technical</span>
          {renderStarRating(feedback.technicalScore)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Communication</span>
          {renderStarRating(feedback.communicationScore)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Confidence</span>
          {renderStarRating(feedback.confidenceScore)}
        </div>
      </div>

      {/* Overall & Decision */}
      <div className="border-t border-slate-700/40 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Overall</p>
            <p className="text-2xl font-bold text-indigo-400">{feedback.overallScore.toFixed(1)}/10</p>
          </div>
          <div className={`px-3 py-2 rounded-lg border text-xs font-semibold ${getHiringDecisionColor(feedback.hiringDecision)}`}>
            {getHiringDecisionLabel(feedback.hiringDecision)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackDetailView({ feedback, onBack, isGiven }) {
  const person = isGiven ? feedback.intervieweeId : feedback.interviewerId;
  const date = new Date(feedback.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getHiringDecisionBg = (decision) => {
    const colors = {
      strong_hire: "bg-green-600/20 border-green-500/50 text-green-300",
      hire: "bg-blue-600/20 border-blue-500/50 text-blue-300",
      hold: "bg-yellow-600/20 border-yellow-500/50 text-yellow-300",
      no_hire: "bg-red-600/20 border-red-500/50 text-red-300",
    };
    return colors[decision] || "bg-gray-600/20 border-gray-500/50 text-gray-300";
  };

  const getHiringDecisionLabel = (decision) => {
    const labels = {
      strong_hire: "🚀 Strong Hire",
      hire: "✅ Hire",
      hold: "⏳ On Hold",
      no_hire: "❌ No Hire",
    };
    return labels[decision] || "Unknown";
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition text-sm font-semibold"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <div className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-8">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-slate-700/40">
          <h2 className="text-3xl font-bold mb-2">{person?.name}</h2>
          <p className="text-gray-400 mb-1">{person?.email}</p>
          <p className="text-sm text-gray-500">Feedback received on {date}</p>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/40">
            <p className="text-gray-400 text-sm mb-2">Technical Skill</p>
            <p className={`text-3xl font-bold ${getScoreColor(feedback.technicalScore)}`}>
              {feedback.technicalScore}.0
            </p>
            <p className="text-xs text-gray-500 mt-1">/10</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/40">
            <p className="text-gray-400 text-sm mb-2">Communication</p>
            <p className={`text-3xl font-bold ${getScoreColor(feedback.communicationScore)}`}>
              {feedback.communicationScore}.0
            </p>
            <p className="text-xs text-gray-500 mt-1">/10</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/40">
            <p className="text-gray-400 text-sm mb-2">Confidence</p>
            <p className={`text-3xl font-bold ${getScoreColor(feedback.confidenceScore)}`}>
              {feedback.confidenceScore}.0
            </p>
            <p className="text-xs text-gray-500 mt-1">/10</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-6 mb-8">
          <p className="text-gray-400 text-sm mb-2">Overall Score</p>
          <p className="text-4xl font-bold text-indigo-400 mb-1">{feedback.overallScore.toFixed(1)}</p>
          <p className="text-sm text-gray-400">/10</p>
        </div>

        {/* Hiring Decision */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Hiring Decision</h3>
          <div className={`inline-block px-6 py-3 rounded-lg border-2 font-semibold text-lg ${getHiringDecisionBg(feedback.hiringDecision)}`}>
            {getHiringDecisionLabel(feedback.hiringDecision)}
          </div>
        </div>

        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-400">💪 Strengths</h3>
            <div className="space-y-2">
              {feedback.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="text-green-400 font-bold mt-0.5">✓</span>
                  <p>{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {feedback.weaknesses && feedback.weaknesses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Areas for Improvement</h3>
            <div className="space-y-2">
              {feedback.weaknesses.map((weakness, idx) => (
                <div key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="text-red-400 font-bold mt-0.5">!</span>
                  <p>{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📝 Detailed Feedback</h3>
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700/40">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{feedback.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
