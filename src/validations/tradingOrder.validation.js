const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTradingOrder = {
  body: Joi.object().keys({
    userId: Joi.string(),
    copiedTo: Joi.string(),
    symbol: Joi.string(),
    digits: Joi.number(),
    operation: Joi.string(),
    volume: Joi.number(),
    openTime: Joi.date(),
    state: Joi.number(),
    openPrice: Joi.number(),
    sl: Joi.number(),
    tp: Joi.number(),
    closeTime: Joi.date(),
    expiration: Joi.date(),
    reason: Joi.number(),
    commission: Joi.number(),
    storage: Joi.number(),
    closePrice: Joi.number(),
    profit: Joi.number(),
    taxes: Joi.number(),
    magic: Joi.number(),
    comment: Joi.string(),
    activation: Joi.number(),
    marginRate: Joi.number(),
    isDeleted: Joi.boolean(),
  }),
};

const getTradingOrder = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTradingOrderById = {
  params: Joi.object().keys({
    orderId: Joi.string(),
  }),
};
const updateTradingOrder = {
  params: Joi.object().keys({
    orderId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      copiedTo: Joi.string(),
      symbol: Joi.string(),
      digits: Joi.number(),
      operation: Joi.string(),
      volume: Joi.number(),
      openTime: Joi.date(),
      state: Joi.number(),
      openPrice: Joi.number(),
      sl: Joi.number(),
      tp: Joi.number(),
      closeTime: Joi.date(),
      expiration: Joi.date(),
      reason: Joi.number(),
      commission: Joi.number(),
      storage: Joi.number(),
      closePrice: Joi.number(),
      profit: Joi.number(),
      taxes: Joi.number(),
      magic: Joi.number(),
      comment: Joi.string(),
      activation: Joi.number(),
      marginRate: Joi.number(),
      isDeleted: Joi.boolean(),
    })
    .min(1),
};

const deleteTradingOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      isDeleted: Joi.boolean(),
    })
    .min(1),
};

module.exports = {
  createTradingOrder,
  getTradingOrder,
  getTradingOrderById,
  updateTradingOrder,
  deleteTradingOrder,
};
