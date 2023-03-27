const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUserStrategy = {
  body: Joi.object().keys({
    name: Joi.string().required(),
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
      name: Joi.string(),
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
