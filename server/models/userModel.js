import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["interviewer", "interviewee"],
      required: true
    },

    interviewsGiven: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewRoom"
      }
    ],

    interviewsTaken: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewRoom"
      }
    ],

    /* 🔐 AUTH / SECURITY FIELDS */
    isVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String
    },

    otpExpiresAt: {
      type: Date
    }
  },
  { timestamps: true }
);

/* HASH PASSWORD */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

/* COMPARE PASSWORD */
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
