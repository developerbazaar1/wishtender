const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    Totalamount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    cartItemIds: {
      type: [Schema.Types.ObjectId],
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paidDate: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "any",
        "processing",
        "paid",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "trash",
      ],
      default: "any",
    },
    termscondition: {
      type: Boolean,
      default: true,
    },
    items: [
      {
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
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
