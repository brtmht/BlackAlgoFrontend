const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userStrategySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    strategyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Strategy',
      required: true,
    },
    exchangeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Exchange',
      required: true,
    },
    regionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Region',
      required: true,
    },
    subscriptionPlanId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
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
