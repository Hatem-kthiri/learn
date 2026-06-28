const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { createServer } = require("http");
require("dotenv").config();

const initSocket = require("./socket");

const PORT = process.env.PORT || 5000;

const app = express();

// ─── Body limits (10mb is generous; 500mb is a DoS vector) ───────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ─── CORS ────────────────────────────────────────────────────────────────────
// Read allowed origins from .env: ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

// ─── HTTP server + Socket.io ──────────────────────────────────────────────
// Real-time chat was fully commented out in the original code. The event
// contract (setup/join-chat/typing/stop-typing/new-message/message-received)
// is implemented in socket.js and matches what the frontend already expects.
const httpServer = createServer(app);
const io = initSocket(httpServer, allowedOrigins);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/admin/", require("./routes/admin"));
app.use("/api/user/", require("./routes/user"));
app.use("/api/instructor/", require("./routes/Instructor"));
app.use("/api/v1/chat", require("./routes/chat"));
app.use("/api/v1/message", require("./routes/message"));

// ─── Database + Start ────────────────────────────────────────────────────────
const connect = (url) =>
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

const start = async () => {
  try {
    await connect(process.env.mongoURI);
    console.log("Connection Established!");
    httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

start();
