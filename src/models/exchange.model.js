const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants');

const exchangeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: [constants.TRADING_ORDER_TYPE.BINANCE, constants.TRADING_ORDER_TYPE.MT4],
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
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
exchangeSchema.plugin(toJSON);
exchangeSchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The exchange's name
 * @param {ObjectId} [excludeExchangeId] - The id of the exchange to be excluded
 * @returns {Promise<boolean>}
 */
exchangeSchema.statics.isNameTaken = async function (name, excludeExchangeId) {
  const exchange = await this.findOne({ name, _id: { $ne: excludeExchangeId } });
  return !!exchange;
};

/**
 * @typedef Exchange
 */
const Exchange = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchange;
