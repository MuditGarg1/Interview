import mongoose from "mongoose";

const interviewRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    password: {
      type: String,
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
      default: null
    },

    status: {
      type: String,
      enum: ["waiting", "active", "ended"],
      default: "waiting",
      index: true
    },

    startedAt: Date,
    endedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("InterviewRoom", interviewRoomSchema);
