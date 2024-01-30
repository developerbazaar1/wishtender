const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
      goalName: {
        type: String,
        required: true,
      },
      goalPrice: {
        type: Number,
        required: true,
      },
      goalType: {
        type: String,
        enum: ['single', 'subscription', 'crowd'],
        default: 'single', 
      },
      goalPurchaseType: {
        type: String,
        enum: ['single', 'multiple'],
        default: 'multiple', 
      },
      goalCategory: {
        type: String,
        required: true,
      },
      goalImage: {
        type: String, 
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'unactive'],
        default: 'active', 
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
 
  },{
    timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);
