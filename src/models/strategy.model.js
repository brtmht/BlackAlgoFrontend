const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const strategySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    shortDescription:  {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    annual_return_percentage: {
      type: Number,
      default: 0,
    },
    monthly_return_percentage: {
      type: Number,
      default: 0,
    },
    risk_level: {
      type: String,
      default: '',
    },
    min_portfolio: {
      type: Number,
      default: 0,
    },
    max_drawdown_percentage: {
      type: Number,
      default: 0,
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
strategySchema.plugin(toJSON);
strategySchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The strategy's name
 * @param {ObjectId} [excludeStrategyId] - The id of the strategy to be excluded
 * @returns {Promise<boolean>}
 */
strategySchema.statics.isNameTaken = async function (name, excludeStrategyId) {
  const strategy = await this.findOne({ name, _id: { $ne: excludeStrategyId } });
  return !!strategy;
};

/**
 * @typedef Strategy
 */
const Strategy = mongoose.model('Strategy', strategySchema);

module.exports = Strategy;
