const { Server } = require("socket.io");

/**
 * Wires up real-time chat events on top of the existing HTTP server.
 *
 * This restores the chat functionality that shipped fully commented-out in
 * the original server.js. The event contract here (`setup`, `join-chat`,
 * `typing`, `stop-typing`, `new-message`, `message-received`) matches what
 * the frontend (frontend/src/Pages/Chat/SingleChat.js) already emits and
 * listens for — that file was written against this exact contract and
 * never needed to change.
 *
 * @param {import('http').Server} httpServer
 * @param {string[]} allowedOrigins - same allowlist used for HTTP CORS
 */
function initSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    // Chat doesn't move large payloads; the original 10e9 (10GB) buffer
    // size was almost certainly copy-pasted from a tutorial and is an
    // unnecessary DoS surface. 1MB is generous for chat messages.
    maxHttpBufferSize: 1e6,
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    let setupUserId = null;

    // Join the caller's own room (keyed by user._id) so the server can
    // target them directly for notifications / direct messages.
    socket.on("setup", (user) => {
      if (!user || !user._id) return;
      setupUserId = user._id;
      socket.join(user._id);
      socket.emit("connected");
    });

    socket.on("join-chat", (room) => {
      if (!room) return;
      socket.join(room);
    });

    socket.on("typing", (room) => {
      if (!room) return;
      socket.in(room).emit("typing");
    });

    socket.on("stop-typing", (room) => {
      if (!room) return;
      socket.in(room).emit("stop-typing");
    });

    socket.on("new-message", (newMessageReceived) => {
      const chat = newMessageReceived?.chat;
      if (!chat || !chat.users) {
        console.log("chat.users not defined");
        return;
      }

      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message-received", newMessageReceived);
      });
    });

    socket.on("disconnect", () => {
      if (setupUserId) {
        socket.leave(setupUserId);
      }
    });
  });

  return io;
}

module.exports = initSocket;
