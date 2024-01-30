const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deleteAccountSchema = new Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      deletedAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model('DeleteAccount', deleteAccountSchema);
