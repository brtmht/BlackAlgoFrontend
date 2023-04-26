const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const supportChatSchema = mongoose.Schema(
  {
    supportId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Support',
    },
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
supportChatSchema.plugin(toJSON);
supportChatSchema.plugin(paginate);

/**
 * @typedef Support
 */
const SupportChat = mongoose.model('SupportChat', supportChatSchema);

module.exports = SupportChat;
