const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants')

const paymentDetailSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        cryptoId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'CryptoAccount',
            default: null
        },
        stripeAccountId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'StripeAccount',
            default: null
        },
        subscriptionPlanId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SubscriptionPlan',
            default: null
        },
        paymentType: {
            type: String,
            enum: [constants.PAYMENT_TYPE.CARD, constants.PAYMENT_TYPE.CRYPTO],
        },
        paymentStatus: {
            type: String,   
            enum: [constants.PAYMENT_STATUS.PENDING, constants.PAYMENT_STATUS.REFUNDED,constants.PAYMENT_STATUS.FAILED, constants.PAYMENT_STATUS.COMPLETED, constants.PAYMENT_STATUS.CANCELLED],
          },
          isDeleted: {
            type: Boolean,
            default: false,
          }
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
