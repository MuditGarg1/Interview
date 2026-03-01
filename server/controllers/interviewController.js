import InterviewRoom from "../models/InterviewModel.js";
import User from "../models/userModel.js";
import Scorecard from "../models/ScorecardModel.js";
import generateMeetingId from "../utils/generateMeetingId.js";

export const createRoom = async (req, res) => {
  try {
    const { password } = req.body;
    const interviewerId = req.user._id;

    let roomId;
    let exists = true;

    while (exists) {
      roomId = generateMeetingId();
      exists = await InterviewRoom.findOne({ roomId });
    }

    const room = await InterviewRoom.create({
      roomId,
      password,
      interviewerId,
      status: "waiting",
    });

    res.status(201).json({ roomId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create room" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId, password } = req.body;
    const intervieweeId = req.user._id;

    const room = await InterviewRoom.findOne({ roomId });

    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.password !== password)
      return res.status(401).json({ error: "Wrong password" });
    if (room.status === "ended")
      return res.status(400).json({ error: "Room ended" });
    if (room.intervieweeId && room.intervieweeId.toString() !== intervieweeId.toString())
      return res.status(409).json({ error: "Interviewee already joined" });

    if (!room.intervieweeId) {
      room.intervieweeId = intervieweeId;
    }
    if (room.status !== "active") {
      room.status = "active";
      room.startedAt = room.startedAt || new Date();
    }

    await room.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Join failed" });
  }
};


export const verifyRoomAccess = async (req, res) => {
  try {
    const { roomId, role } = req.body;
    const userId = req.user._id;

    const room = await InterviewRoom.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.status === "ended")
      return res.status(400).json({ error: "Room ended" });

    if (role === "host") {
      if (room.interviewerId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Not authorized as host" });
      }
      return res.json({ allowed: true });
    }

    if (role === "client") {
      if (!room.intervieweeId) {
        return res.status(403).json({ error: "Client not joined yet" });
      }
      if (room.intervieweeId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Not authorized as client" });
      }
      return res.json({ allowed: true });
    }

    return res.status(400).json({ error: "Invalid role" });
  } catch (error) {
    res.status(500).json({ error: "Verify failed" });
  }
};

export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await InterviewRoom.findOne({ roomId });

    if (!room)
      return res.status(404).json({ error: "Room not found" });

    room.status = "ended";
    room.endedAt = new Date();
    await room.save();

    await User.findByIdAndUpdate(room.interviewerId, {
      $push: { interviewsGiven: room._id }
    });

    if (room.intervieweeId) {
      await User.findByIdAndUpdate(room.intervieweeId, {
        $push: { interviewsTaken: room._id }
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "End failed" });
  }
};

// Submit feedback after interview
export const submitFeedback = async (req, res) => {
  try {
    const { roomId, technicalScore, communicationScore, confidenceScore, strengths, weaknesses, notes, hiringDecision } = req.body;
    const interviewerId = req.user._id;

    // Find the interview room
    const room = await InterviewRoom.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Verify interviewer
    if (room.interviewerId.toString() !== interviewerId.toString()) {
      return res.status(403).json({ error: "Only interviewer can submit feedback" });
    }

    if (!room.intervieweeId) {
      return res.status(400).json({ error: "No interviewee in this interview" });
    }

    // Calculate overall score
    const overallScore = (technicalScore + communicationScore + confidenceScore) / 3;

    // Create scorecard
    const scorecard = await Scorecard.create({
      interviewId: room._id,
      interviewerId,
      intervieweeId: room.intervieweeId,
      technicalScore,
      communicationScore,
      confidenceScore,
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      notes,
      hiringDecision,
      overallScore: parseFloat(overallScore.toFixed(2))
    });

    res.status(201).json({ 
      success: true, 
      message: "Feedback submitted successfully",
      scorecard 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

// Get feedback given by user (as interviewer)
export const getFeedbackGiven = async (req, res) => {
  try {
    const interviewerId = req.user._id;

    const feedbacks = await Scorecard.find({ interviewerId })
      .populate("intervieweeId", "name email")
      .populate("interviewId", "roomId startedAt endedAt")
      .sort({ createdAt: -1 });

    res.json({ feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch feedback given" });
  }
};

// Get feedback received by user (as interviewee)
export const getFeedbackReceived = async (req, res) => {
  try {
    const intervieweeId = req.user._id;

    const feedbacks = await Scorecard.find({ intervieweeId })
      .populate("interviewerId", "name email")
      .populate("interviewId", "roomId startedAt endedAt")
      .sort({ createdAt: -1 });

    res.json({ feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch feedback received" });
  }
};

// Get single feedback details
export const getFeedbackDetails = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user._id;

    const scorecard = await Scorecard.findById(feedbackId)
      .populate("interviewerId", "name email")
      .populate("intervieweeId", "name email")
      .populate("interviewId", "roomId startedAt endedAt");

    if (!scorecard) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Verify user is either interviewer or interviewee
    if (scorecard.interviewerId.toString() !== userId.toString() && 
        scorecard.intervieweeId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to view this feedback" });
    }

    res.json({ scorecard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch feedback details" });
  }
};

// Get room details with populated user information
export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await InterviewRoom.findOne({ roomId })
      .populate("interviewerId", "name email")
      .populate("intervieweeId", "name email");

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Verify user is participant in the room
    if (room.interviewerId._id.toString() !== userId.toString() && 
        room.intervieweeId && room.intervieweeId._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to view this room" });
    }

    res.json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch room details" });
  }
};
