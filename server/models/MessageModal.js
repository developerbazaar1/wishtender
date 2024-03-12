const mongoose = require("mongoose");

const MessageModal = new mongoose.Schema({
  messageSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    trim: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
});

module.exports = mongoose.model("Message", MessageModal);
