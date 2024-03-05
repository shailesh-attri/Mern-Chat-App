import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
  const user = userSocketMap[receiverId];
  if (user && !user.blockedUsers.includes(receiverId)) {
    return user.socketId;
  }
  return null; // Return null if the receiver is blocked or not found
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = {
      socketId: socket.id,
      blockedUsers: [], // Initialize blockedUsers array
    };
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("blockUser", (blockedUserId, senderId) => {
    const user = userSocketMap[blockedUserId];
    if (user) {
      user.blockedUsers.push(blockedUserId);
      // Optionally, you can notify the client that the user has been blocked
      io.to(user.socketId).emit("userBlocked", blockedUserId, senderId);
    }
  });

  socket.on("unblockUser", (blockedUserId, sendUserId) => {
    const user = userSocketMap[blockedUserId];
    if (user) {
      const index = user.blockedUsers.indexOf(blockedUserId);
      if (index !== -1) {
        user.blockedUsers.splice(index, 1);
        // Optionally, you can notify the client that the user has been unblocked
        io.to(user.socketId).emit("userUnBlocked", blockedUserId, sendUserId);
      }
    }
  });

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
