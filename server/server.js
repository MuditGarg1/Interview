import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import aiInterviewRoutes from "./routes/aiInterviewRoutes.js";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  transports: ["websocket", "polling"],
  maxHttpBufferSize: 1e6, // 1MB limit per message
  perMessageDeflate: {
    threshold: 1024, // Compress messages > 1KB
  },
});

io.setMaxListeners(10);
server.setMaxListeners(10);

const roomCodeState = new Map();
const codeChangeThrottle = new Map();
const THROTTLE_CLEANUP_INTERVAL = 30000; // Cleanup every 30s
const MAX_THROTTLE_ENTRIES = 1000; // Max entries before cleanup

const shouldThrottleCodeChange = (socketId, minWaitMs = 200) => {
  const lastTime = codeChangeThrottle.get(socketId) || 0;
  const now = Date.now();
  if (now - lastTime >= minWaitMs) {
    codeChangeThrottle.set(socketId, now);
    return false;
  }
  return true;
};

// Cleanup old throttle entries periodically to prevent memory leak
setInterval(() => {
  if (codeChangeThrottle.size > MAX_THROTTLE_ENTRIES) {
    const now = Date.now();
    let removed = 0;
    for (const [socketId, timestamp] of codeChangeThrottle.entries()) {
      if (now - timestamp > 60000) { // Remove entries older than 1 minute
        codeChangeThrottle.delete(socketId);
        removed++;
      }
    }
    if (removed > 0) console.log(`🧹 Cleaned up ${removed} throttle entries`);
  }
}, THROTTLE_CLEANUP_INTERVAL);

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.data.roomId = null;
  socket.data.role = null;

  socket.on("join-video-room", ({ roomId, role }) => {
    socket.join(`${roomId}-video`);
    socket.data.roomId = roomId;
    socket.data.role = role;

    console.log(`🎥 ${socket.id} joined ${roomId}-video as ${role}`);

    const room = io.sockets.adapter.rooms.get(`${roomId}-video`);
    const size = room ? room.size : 0;
    if (size > 1) {
      const payload = { socketId: socket.id, role };
      socket.emit("peer-joined", payload);
      socket.to(`${roomId}-video`).emit("peer-joined", payload);
    }
  });

  socket.on("join-chat-room", (roomId) => {
    socket.join(`${roomId}-chat`);
    console.log(`💬 ${socket.id} joined ${roomId}-chat`);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(`${roomId}-video`).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(`${roomId}-video`).emit("answer", answer);
  });

  socket.on("ice", ({ roomId, candidate }) => {
    socket.to(`${roomId}-video`).emit("ice", candidate);
  });

  socket.on("chat", ({ roomId, msg, sender, ts }) => {
    socket.to(`${roomId}-chat`).emit("chat", { msg, sender, ts });
  });

  socket.on("leave-video-room", (roomId) => {
    socket.leave(`${roomId}-video`);
    socket.to(`${roomId}-video`).emit("peer-left", { socketId: socket.id });
  });

  socket.on("leave-chat-room", (roomId) => {
    socket.leave(`${roomId}-chat`);
  });

  socket.on("host-end-room", (roomId) => {
    const videoRoom = `${roomId}-video`;
    const chatRoom = `${roomId}-chat`;
    const codeRoom = `${roomId}-code`;

    io.to(videoRoom).emit("meeting-ended");
    io.to(chatRoom).emit("meeting-ended");

    io.socketsLeave(videoRoom);
    io.socketsLeave(chatRoom);
    io.socketsLeave(codeRoom);
    
    roomCodeState.delete(roomId);

    console.log("🚫 Meeting ended by host:", roomId);
  });

  socket.on("join-code-room", (roomId) => {
    socket.join(`${roomId}-code`);
    console.log(`🧠 ${socket.id} joined ${roomId}-code`);

    const existingCode = roomCodeState.get(roomId) || "";
    socket.emit("code-sync", existingCode);
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (shouldThrottleCodeChange(socket.id, 200)) {
      return;
    }

    roomCodeState.set(roomId, code);
    socket.to(`${roomId}-code`).emit("code-update", code);
  });

  socket.on("leave-code-room", (roomId) => {
    socket.leave(`${roomId}-code`);
  });

  socket.on("disconnect", () => {
    const { roomId, role } = socket.data;

    // Immediate cleanup of throttle entry
    codeChangeThrottle.delete(socket.id);

    if (role === "host" && roomId) {
      const videoRoom = `${roomId}-video`;
      const chatRoom = `${roomId}-chat`;
      const codeRoom = `${roomId}-code`;

      io.to(videoRoom).emit("meeting-ended");
      io.to(chatRoom).emit("meeting-ended");

      io.socketsLeave(videoRoom);
      io.socketsLeave(chatRoom);
      io.socketsLeave(codeRoom);
      
      roomCodeState.delete(roomId);

      console.log("🚫 Host disconnected, meeting ended:", roomId);
    }

    console.log("❌ Disconnected:", socket.id);
  });
});

const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);

server.listen(port, () =>
  console.log(`Server + Socket running on port : ${port}`)
);