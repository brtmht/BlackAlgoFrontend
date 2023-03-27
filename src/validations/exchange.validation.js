const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createExchange = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getExchanges = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getExchange = {
  params: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
  }),
};

const updateExchange = {
  params: Joi.object().keys({
    exchangeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteExchange = {
  params: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createExchange,
  getExchanges,
  getExchange,
  updateExchange,
  deleteExchange,
};
