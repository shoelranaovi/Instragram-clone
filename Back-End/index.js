const express = require("express");

const ConnectDb = require("./confiq/connectDb");
const userRoute = require("./Route/userRoute");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postRouter = require("./Route/postRoute");
const messageRouter = require("./Route/messageRoute");
const { app, server } = require("./socket/socket");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", userRoute);
app.use("/api/post", postRouter);
app.use("/api/msg", messageRouter);

app.use((err, req, res, next) => {
  const message = err.message || "something Error";
  const statusCode = err.statusCode || 400;
  res.status(statusCode).json({
    message,
    statusCode,
    error: true,
    success: false,
  });
});

const PORT = 3000;
ConnectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
