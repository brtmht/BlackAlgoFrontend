const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants');

const paymentDetailSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      default: null,
    },
    cryptoId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'CryptoAccount',
      default: null,
    },
    stripeAccountId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'StripeAccount',
      default: null,
    },
    subscriptionPlanId: {
      type: String,
      default: null,
    },
    paymentType: {
      type: String,
      enum: [constants.PAYMENT_TYPE.CARD, constants.PAYMENT_TYPE.CRYPTO],
    },
    paymentToken: {
      type: String,
      unique: true,
    },
    portfolioAmount: {
      type: Number,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: [
        constants.PAYMENT_STATUS.INCOMLETE,
        constants.PAYMENT_STATUS.PENDING,
        constants.PAYMENT_STATUS.REFUNDED,
        constants.PAYMENT_STATUS.FAILED,
        constants.PAYMENT_STATUS.SUCCEDED,
        constants.PAYMENT_STATUS.CANCELLED,
      ],
      default: constants.PAYMENT_STATUS.INCOMLETE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentDetailSchema.plugin(toJSON);
paymentDetailSchema.plugin(paginate);

/**
 * @typedef PaymentDetail
 */
const PaymentDetail = mongoose.model('PaymentDetail', paymentDetailSchema);

module.exports = PaymentDetail;
