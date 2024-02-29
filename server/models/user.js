const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    currency: {
      type: String,
    },
    promotionCompany: {
      type: String,
    },
    displayNameInPublicRankingPage: {
      type: Boolean,
      default: false,
    },
    surpriceContribution: {
      type: Boolean,
      default: false,
    },
    surpriceContributionAmount: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    bannerImage: {
      type: String,
    },
    setAutoPost: {
      type: Boolean,
      default: false,
    },
    agreeTermConditions: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: true,
    },
    role: {
      type: String,
      enum: ["fighter", "companion"],
      default: "fighter",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    cart: [
      {
        shopType: {
          type: String,
          enum: ["goal", "surprise"],
          default: "goal",
        },
        goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
        quantity: Number,
        goalType: String,
        amount: String,
        senderMessage: String,
        fighterId: String,
      },
    ],
    socialLinks: [
      {
        platform: {
          type: String,
          enum: [
            "Facebook",
            "Twitter",
            "Instagram",
            "LinkedIn",
            "Tiktok",
            "Other",
          ], // Adjust as needed
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
