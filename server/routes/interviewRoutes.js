import express from "express";
import {
  createRoom,
  joinRoom,
  endRoom,
  verifyRoomAccess,
  submitFeedback,
  getFeedbackGiven,
  getFeedbackReceived,
  getFeedbackDetails,
  getRoomDetails
} from "../controllers/interviewController.js";
import { protect } from "../middleware/userAUTH.js";

const router = express.Router();

router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.post("/end", protect, endRoom);
router.post("/verify", protect, verifyRoomAccess);
router.get("/room/:roomId", protect, getRoomDetails);

// Feedback routes
router.post("/feedback/submit", protect, submitFeedback);
router.get("/feedback/given", protect, getFeedbackGiven);
router.get("/feedback/received", protect, getFeedbackReceived);
router.get("/feedback/:feedbackId", protect, getFeedbackDetails);

export default router;
