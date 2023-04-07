const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUserStrategy = {
  body: Joi.object().keys({
    step: Joi.string(),
    paymentDetailId: Joi.string().custom(objectId),
    strategyId: Joi.string().custom(objectId),
    exchangeId: Joi.string().custom(objectId),
    regionId: Joi.string().custom(objectId),
    subscriptionPlanId: Joi.string().custom(objectId),
  }),
};

const getUserStrategies = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUserStrategy = {
  params: Joi.object().keys({
    userStrategyId: Joi.string().custom(objectId),
  }),
};

const updateUserStrategy = {
  params: Joi.object().keys({
    userStrategyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      paymentDetailId: Joi.string().custom(objectId),
      strategyId: Joi.string().custom(objectId),
      exchangeId: Joi.string().custom(objectId),
      regionId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteUserStrategy = {
  params: Joi.object().keys({
    userStrategyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUserStrategy,
  getUserStrategies,
  getUserStrategy,
  updateUserStrategy,
  deleteUserStrategy,
};
