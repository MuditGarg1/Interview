import mongoose from "mongoose";

const codeSnapshotSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewRoom",
      required: true,
      index: true
    },

    code: {
      type: String,
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: false }
);

export default mongoose.model("CodeSnapshot", codeSnapshotSchema);
