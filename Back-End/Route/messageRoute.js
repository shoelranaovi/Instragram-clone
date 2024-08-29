const express = require("express");
const verify = require("../middlewear/verify");
const Conversation = require("../model/conversation.model");
const Message = require("../model/massage.model");
const errorHandeler = require("../middlewear/error");
const { getReciverSocketId, io } = require("../socket/socket");

const messageRouter = express.Router();
messageRouter.post("/sendmassage/:id", verify, async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    const participants = [senderId, receiverId].sort();
    let conversation = await Conversation.findOne({
      participants,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants,
      });
    }
    const newMassage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMassage) conversation.messages.push(newMassage._id);
    await Promise.all([conversation.save(), newMassage.save()]);
    const reciverSocketId = getReciverSocketId(receiverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMassage", newMassage);
    }
    res.status(200).json({
      message: "message send successfull",
      data: newMassage,

      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
messageRouter.get("/getMessage/:id", verify, async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!conversation) return next(errorHandeler(400, "error"));

    res.status(200).json({
      message: "message send successfull",
      datatwo: conversation.messages,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});

module.exports = messageRouter;
