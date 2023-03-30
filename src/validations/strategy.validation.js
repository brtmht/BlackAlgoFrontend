const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStrategy = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description:Joi.string(),
    annual_return_percentage:Joi.number(),
    risk_level:Joi.string(),
    max_drawdown_percentage:Joi.number(),
  }),
};

const getStrategies = {
  query: Joi.object().keys({
    name: Joi.string(),
    description:Joi.string(),
    annual_return_percentage:Joi.number(),
    risk_level:Joi.string(),
    max_drawdown_percentage:Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStrategy = {
  params: Joi.object().keys({
    strategyId: Joi.string().custom(objectId),
  }),
};

const updateStrategy = {
  params: Joi.object().keys({
    strategyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteStrategy = {
  params: Joi.object().keys({
    strategyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createStrategy,
  getStrategies,
  getStrategy,
  updateStrategy,
  deleteStrategy,
};
