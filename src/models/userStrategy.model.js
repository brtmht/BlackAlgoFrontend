const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userStrategySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    paymentDetailId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PaymentDetail',
    },
    strategyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Strategy',
    },
    exchangeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Exchange',
    },
    use_futures: {
      type: mongoose.SchemaTypes.Boolean,
    },
    subscriptionPlanId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SubscriptionPlan',
    },
    onBoardProcess: {
      type: Boolean,
      default: false,
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
