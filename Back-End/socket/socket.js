const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const userSocketMap = {};
const getReciverSocketId = (reciverId) => userSocketMap[reciverId];
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`user is connected : UserId= ${userId},socketId=${socket.id}`);
  }
  io.emit("getOnlineUser", Object.keys(userSocketMap));
  io.emit("notification", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, getReciverSocketId };
