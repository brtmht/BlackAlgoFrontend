const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userExchangeConfigSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    strategyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Strategy',
    },
    exchangeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Exchange',
    },
    config: {
      type:Object,
      default:{}
    },
    serverToken: {
      type: String,
      default: '',
    },
    connected: {
      type: Boolean,
      default: false,
    },
    tokenExpiry: {
      type: Date,
      default: '',
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
userExchangeConfigSchema.plugin(toJSON);
userExchangeConfigSchema.plugin(paginate);

/**
 * @typedef userExchangeConfig
 */
const userExchangeConfig = mongoose.model('user-exchange-config', userExchangeConfigSchema);

module.exports = userExchangeConfig;
