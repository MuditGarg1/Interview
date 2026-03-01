import { useState } from "react";
import { X, Send } from "lucide-react";
import axios from "../../utils/axios";

export default function FeedbackForm({ roomId, intervieweeEmail, onClose, onSubmitSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    technicalScore: 5,
    communicationScore: 5,
    confidenceScore: 5,
    hiringDecision: "hire",
    strengths: "",
    weaknesses: "",
    notes: "",
  });

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        roomId,
        technicalScore: formData.technicalScore,
        communicationScore: formData.communicationScore,
        confidenceScore: formData.confidenceScore,
        hiringDecision: formData.hiringDecision,
        strengths: formData.strengths.split("\n").filter(s => s.trim()),
        weaknesses: formData.weaknesses.split("\n").filter(w => w.trim()),
        notes: formData.notes,
      };

      await axios.post("/interview/feedback/submit", payload);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      alert("Feedback submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(error.response?.data?.error || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const overallScore = ((formData.technicalScore + formData.communicationScore + formData.confidenceScore) / 3).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-24 z-[99999] p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl my-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Candidate Feedback Form</h2>
            <p className="text-gray-600 text-sm mt-1">{intervieweeEmail || "Candidate"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            disabled={loading}
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Overall Score Display */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Overall Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">{overallScore}</span>
                  <span className="text-gray-600">/10</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Average of three scores</p>
              </div>
            </div>
          </div>

          {/* Scoring Section */}
          <div className="space-y-6">
            {/* Technical Proficiency */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Technical Proficiency</label>
                <span className="text-lg font-bold text-gray-700">{formData.technicalScore}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.technicalScore}
                onChange={(e) => handleSliderChange("technicalScore", e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500 mt-2">Problem-solving, coding skills, technical knowledge</p>
            </div>

            {/* Communication Skills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Communication Skills</label>
                <span className="text-lg font-bold text-gray-700">{formData.communicationScore}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.communicationScore}
                onChange={(e) => handleSliderChange("communicationScore", e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500 mt-2">Clarity, explanation ability, articulation</p>
            </div>

            {/* Confidence & Presence */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-900 font-semibold">Confidence & Presence</label>
                <span className="text-lg font-bold text-gray-700">{formData.confidenceScore}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.confidenceScore}
                onChange={(e) => handleSliderChange("confidenceScore", e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500 mt-2">Self-assurance, professionalism, engagement level</p>
            </div>
          </div>

          {/* Hiring Decision */}
          <div>
            <label className="block text-gray-900 font-semibold mb-4">Hiring Decision</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: "strong_hire", label: "Strong Hire" },
                { value: "hire", label: "Hire" },
                { value: "hold", label: "Hold" },
                { value: "no_hire", label: "No Hire" },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTextChange("hiringDecision", option.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition font-semibold text-sm ${
                    formData.hiringDecision === option.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">Key Strengths</label>
            <p className="text-xs text-gray-500 mb-3">(One per line, optional)</p>
            <textarea
              value={formData.strengths}
              onChange={(e) => handleTextChange("strengths", e.target.value)}
              placeholder="Strong problem-solving skills&#10;Excellent communication&#10;Quick learner"
              className="w-full h-24 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Weaknesses */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">Areas for Improvement</label>
            <p className="text-xs text-gray-500 mb-3">(One per line, optional)</p>
            <textarea
              value={formData.weaknesses}
              onChange={(e) => handleTextChange("weaknesses", e.target.value)}
              placeholder="Needs more system design practice&#10;Time management could improve"
              className="w-full h-24 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">Detailed Feedback</label>
            <p className="text-xs text-gray-500 mb-3">Required - Provide comprehensive feedback and recommendations</p>
            <textarea
              value={formData.notes}
              onChange={(e) => handleTextChange("notes", e.target.value)}
              placeholder="Write detailed observations, feedback, and recommendations for the candidate..."
              required
              className="w-full h-32 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold text-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.notes.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}