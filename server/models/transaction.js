const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
    },
    TotalAmount: {
      type: String,
    },
    currency: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    subscriptionId: {
      type: String,
    },
    subscriptionType: {
      type: String,
    },
    paidDate: {
      type: String,
    },
    status: {
      type: String,
    },

    shopType: {
      type: String,
      enum: ["goal", "surprise"],
      default: "goal",
    },
    fighterId: {
      type: String,
    },
    goalId: {
      type: String,
    },
    goalName: {
      type: String,
    },
    goalType: {
      type: String,
    },
    goalImage: {
      type: String,
    },
    creatorId: {
      type: String,
    },
    creatorName: {
      type: String,
    },
    quantity: {
      type: String,
    },
    amount: {
      type: String,
    },
    senderMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
