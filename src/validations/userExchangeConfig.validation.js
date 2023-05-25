const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUserExchangeConfig = {
  body: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
    strategyId: Joi.alternatives().try(Joi.string().custom(objectId), Joi.allow(null)),
    config: Joi.object(),
  }),
};


module.exports = {
  createUserExchangeConfig,
};
