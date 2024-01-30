const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  currency: {
    type: String
  },
  promotionCompany: {
    type: String
  },
  displayNameInPublicRankingPage: {
    type: Number,
    enum: [1, 0],
    default: 0, 
  },
  surpriceContribution: {
    type: Number,
    enum: [1, 0],
    default: 0, 
  },
  surpriceContributionAmount: {
    type: String
  },
  profileImage: {
    type: String
  },
  bannerImage: {
    type: String
  },
  setAutoPost: {
    type: Number,
    enum: [1, 0],
    default: 0, 
  },
  agreeTermConditions: {
    type: Number,
    enum: [1, 0],
    default: 0, 
  },
  status: {
    type: String,
    default: 'active'
  },
  role: {
    type: String,
    enum: ['fighter', 'companion'],
    default: 'fighter', 
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  cart: [
    { 
      shopType: {
        type: String,
        enum: ['goal', 'surprise'],
        default: 'goal', 
      },
      goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }, 
      quantity: Number,
      goalType: String,
      amount:String,
      senderMessage:String,
      fighterId:String
    }
  ],
  socialLinks: [
    {
      platform: {
        type: String,
        enum: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Other'], // Adjust as needed
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
      },
    },
  ],
  },{
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
