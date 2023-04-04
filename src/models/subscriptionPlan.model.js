const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subscriptionPlanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: null,
    },
    min_portfolio_size: {
      type: Number,
    },
    max_portfolio_size: {
      type: Number,
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
subscriptionPlanSchema.plugin(toJSON);
subscriptionPlanSchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The subscriptionPlan's name
 * @param {ObjectId} [excludeSubscriptionPlanId] - The id of the subscriptionPlan to be excluded
 * @returns {Promise<boolean>}
 */
subscriptionPlanSchema.statics.isNameTaken = async function (name, excludeSubscriptionPlanId) {
  const subscriptionPlan = await this.findOne({ name, _id: { $ne: excludeSubscriptionPlanId } });
  return !!subscriptionPlan;
};

/**
 * @typedef SubscriptionPlan
 */
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
