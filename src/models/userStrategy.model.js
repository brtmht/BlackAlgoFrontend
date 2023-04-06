const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userStrategySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentDetailId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'paymentDetail',
    },
    strategyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Strategy',
    },
    exchangeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Exchange',
    },
    regionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Region',
    },
    subscriptionPlanId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SubscriptionPlan',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userStrategySchema.plugin(toJSON);
userStrategySchema.plugin(paginate);

/**
 * @typedef UserStrategy
 */
const UserStrategy = mongoose.model('UserStrategy', userStrategySchema);

module.exports = UserStrategy;
