const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants');

const tradingOrderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    copiedTo: {
      type: String,
      enum: [constants.TRADING_ORDER_TYPE.BINANCE, constants.TRADING_ORDER_TYPE.MT4],
    },
    symbol: {
      type: String,
      default: '',
    },
    digits: {
      type: Number,
      default: 0,
    },
    cmd: {
      type: String,
      enum: [constants.CMD_TYPE.BUY, constants.CMD_TYPE.SELL],
    },
    volume: {
      type: Number,
      default: 0,
    },
    openTime: {
      type: Date,
      default: Date.now(),
    },
    state: {
      type: Number,
      default: 0,
    },
    openPrice: {
      type: Number,
      default: 0,
    },
    sl: {
      type: Number,
      default: 0,
    },
    tp: {
      type: Number,
      default: 0,
    },
    closeTime: {
      type: Date,
      default: Date.now(),
    },
    expiration: {
      type: Date,
      default: Date.now(),
    },
    reason: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    storage: {
      type: Number,
      default: 0,
    },
    closePrice: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    magic: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      default: '',
    },
    activation: {
      type: Number,
      default: 0,
    },
    marginRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tradingOrderSchema.plugin(toJSON);
tradingOrderSchema.plugin(paginate);

/**
 * @typedef TradingOrder
 */
const TradingOrder = mongoose.model('TradingOrder', tradingOrderSchema);

module.exports = TradingOrder;
