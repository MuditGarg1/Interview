import mongoose from "mongoose";

const scorecardSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewRoom",
      required: true
    },

    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    intervieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    technicalScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },

    communicationScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },

    strengths: [String],
    weaknesses: [String],

    notes: {
      type: String,
      required: true
    },

    hiringDecision: {
      type: String,
      enum: ["strong_hire", "hire", "hold", "no_hire"],
      required: true
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Scorecard", scorecardSchema);
