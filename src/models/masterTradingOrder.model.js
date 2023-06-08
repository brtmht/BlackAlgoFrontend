const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants');

const masterTradingOrderSchema = mongoose.Schema(
  {
    copiedTo: {
      type: String,
      enum: [constants.TRADING_ORDER_TYPE.BINANCE, constants.TRADING_ORDER_TYPE.MT4],
    },
    ticket: {
      type: String,
      default: '',
    },
    openTime: {
      type: Date,
      default: Date.now(),
    },
    closeTime: {
      type: Date,
      default: Date.now(),
    },
    expiration: {
      type: Date,
      default: Date.now(),
    },
    operation: {
      type: String,
      enum: [constants.CMD_TYPE.BUY, constants.CMD_TYPE.SELL],
    },
    lots: {
      type: Number,
      default: 0,
    },
    symbol: {
      type: String,
      default: '',
    },
    openPrice: {
      type: Number,
      default: 0,
    },
    stopLoss: {
      type: Number,
      default: 0,
    },
    takeProfit: {
      type: Number,
      default: 0,
    },
    closePrice: {
      type: Number,
      default: 0,
    },
    magic: {
      type: Number,
      default: 0,
    },
    swap: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      default: '',
    },
    profit: {
      type: Number,
      default: 0,
    },
    openRate: {
      type: Number,
      default: 0,
    },
    closeRate: {
      type: Number,
      default: 0,
    },
    digits: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    state: {
      type: Number,
      default: 0,
    },
    reason: {
      type: Number,
      default: 0,
    },
    storage: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    activation: {
      type: Number,
      default: 0,
    },
    marginRate: {
      type: Number,
      default: 0,
    },
    orderType: {
      type: String,
      default: '',
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
masterTradingOrderSchema.plugin(toJSON);
masterTradingOrderSchema.plugin(paginate);

/**
 * @typedef MasterTradingOrder
 */
const MasterTradingOrder = mongoose.model('MasterTradingOrder', masterTradingOrderSchema);

module.exports = MasterTradingOrder;
