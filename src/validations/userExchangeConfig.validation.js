const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUserExchangeConfig = {
  body: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
    strategyId: Joi.string().custom(objectId),
    config: Joi.object(),
  }),
};


module.exports = {
  createUserExchangeConfig,
};
