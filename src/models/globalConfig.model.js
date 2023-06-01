const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const globalConfigSchema = mongoose.Schema(
  {
    conservative_min_amount: {
      type: Number,
      default: null,
    },
    balanced_min_amount: {
      type: Number,
      default: null,
    },
    dynamic_min_amount: {
      type: Number,
      default: null,
    },
    binance_min_amount: {
      type: Number,
      default: null,
    },
    conservative_check_amount: {
      type: Number,
      default: null,
    },
    balanced_check_amount: {
      type: Number,
      default: null,
    },
    dynamic_check_amount: {
      type: Number,
      default: null,
    },
    lots_min_amount:{
      type: Number,
      default: null,
    },
    stripePayment:{
      type: Boolean,
      default: true,
    },
    BinancePayment:{
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
globalConfigSchema.plugin(toJSON);

/**
 * @typedef GlobalConfig
 */
const GlobalConfig = mongoose.model('GlobalConfig', globalConfigSchema);

module.exports = GlobalConfig;
