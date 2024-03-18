const mongoose = require("mongoose");
const ChatModal = require("../models/ChatModal");
const MessageModal = require("../models/MessageModal");
const User = require("../models/user");

//controller to get all message of activity buy providing transactionId
exports.getAllMessageActivity = async (req, res, next) => {
  try {
    const transactionId = req.query.transactionId;
    const chat = await ChatModal.findOne({ transactionId });
    if (!chat) {
      return res.status(200).json({
        message: "No chat found for this activity",
      });
    }

    const messages = await MessageModal.find({ chatId: chat._id })
      .populate(
        "messageSender",
        "firstName lastName profileImage email userName"
      )
      .populate({
        path: "chatId",
        populate: [
          {
            path: "senderId",
            select: "firstName lastName profileImage email userName",
          },
          {
            path: "ReciverId",
            select: "firstName lastName profileImage email userName",
          },
        ],
      });
    return res.status(200).json(messages);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    const createdMessage = await MessageModal.create({
      chatId: mongoose.Types.ObjectId(chatId),
      content: message,
      messageSender: mongoose.Types.ObjectId(req.userId),
    });

    const populatedMessage = await createdMessage
      .populate({
        path: "messageSender",
        select: "firstName lastName profileImage email userName",
      })
      .populate({
        path: "chatId",
        populate: [
          {
            path: "senderId",
            select: "firstName lastName profileImage email userName",
          },
          {
            path: "ReciverId",
            select: "firstName lastName profileImage email userName",
          },
        ],
      })
      .execPopulate();

    await ChatModal.findByIdAndUpdate(chatId, {
      latestMessage: mongoose.Types.ObjectId(createdMessage._id),
    });

    res.status(200).json(populatedMessage);
  } catch (error) {
    console.log("Error in sending message:", error);
    error.status = 400;
    next(error);
  }
};
