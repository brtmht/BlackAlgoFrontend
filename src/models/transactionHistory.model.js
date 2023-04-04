const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants');

const transactionHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentDetailId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PaymentDetail',
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: [constants.PAYMENT_STATUS.FAILED, constants.PAYMENT_STATUS.COMPLETED, constants.PAYMENT_STATUS.CANCELLED],
    },
    paymentTransactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionHistorySchema.plugin(toJSON);
transactionHistorySchema.plugin(paginate);

/**
 * @typedef TransactionHistory
 */
const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

module.exports = TransactionHistory;