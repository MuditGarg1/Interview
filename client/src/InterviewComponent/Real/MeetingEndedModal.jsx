import { CheckCircle, LogOut, FileText } from "lucide-react";

export default function MeetingEndedModal({ 
  isOpen, 
  onOpenFeedback, 
  onLeave, 
  role, 
  otherUserEmail 
}) {
  if (!isOpen) return null;

  const isInterviewer = role === "interviewer" || role === "host";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-24 z-99999 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        
        {/* Header with Icon */}
        <div className="bg-linear-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed</h2>
          <p className="text-gray-600 text-sm">Thank you for your time and participation</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* User Info */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Interview with</p>
            <p className="text-lg font-semibold text-gray-900">{otherUserEmail || "Unknown User"}</p>
          </div>

          {/* Next Steps Message */}
          {isInterviewer && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Provide Feedback</p>
                  <p className="text-sm text-gray-700">Please complete the feedback form to help the candidate improve</p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            {isInterviewer && (
              <button
                onClick={onOpenFeedback}
                className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold text-white flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                Write Feedback
              </button>
            )}
            
            <button
              onClick={onLeave}
              className="w-full px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold text-gray-900 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Leave Interview
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-500 bg-gray-50">
          Feedback will be visible in your dashboard
        </div>
      </div>
    </div>
  );
}