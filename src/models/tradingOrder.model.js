const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require('../config/constants');

const tradingOrderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    copiedTo: {
      type: String,
      enum: [constants.TRADING_ORDER_TYPE.BINANCE, constants.TRADING_ORDER_TYPE.MT4],
    },
    masterTicketId: {
      type: String,
      default: '',
    },
    ticketId: {
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
    balance:{
      type:Number,
      default:0
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
tradingOrderSchema.plugin(toJSON);
tradingOrderSchema.plugin(paginate);

/**
 * @typedef TradingOrder
 */
const TradingOrder = mongoose.model('TradingOrder', tradingOrderSchema);

module.exports = TradingOrder;
