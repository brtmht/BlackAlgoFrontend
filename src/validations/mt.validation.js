const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMtAccount = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    login: Joi.string(),
    password: Joi.string(),
    serverName: Joi.string(),
    isDeleted: Joi.boolean(),
    status: Joi.boolean(),
  }),
};

const getMtAccount = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMtAccountById = {
  params: Joi.object().keys({
    mtAccountId: Joi.string().custom(objectId),
  }),
};

const updateMtAccount = {
  params: Joi.object().keys({
    mtAccountId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      login: Joi.string(),
      password: Joi.string(),
      serverName: Joi.string(),
      isDeleted: Joi.boolean(),
      status: Joi.boolean(),
    })
    .min(1),
};

const deleteMtAccount = {
  params: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
  }),
};

const createMtBroker = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    mtVersion: Joi.string(),
    mtServerFile: Joi.string(),
    brokerTimeZone: Joi.string(),
    brokerDSTSwitchTimeZone: Joi.string(),
    brokerTime: Joi.string(),
    isDeleted: Joi.boolean(),
    status: Joi.boolean(),
  }),
};

const getMtBroker = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMtBrokerById = {
  params: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
  }),
};

const updateMtBrokerById = {
  params: Joi.object().keys({
    exchangeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      mtVersion: Joi.string(),
      mtServerFile: Joi.string(),
      brokenTimeZone: Joi.string(),
      brokerDSTSwitchTimeZone: Joi.string(),
      brokerTime: Joi.string(),
      isDeleted: Joi.boolean(),
      status: Joi.boolean(),
    })
    .min(1),
};

const deleteMtBroker = {
  params: Joi.object().keys({
    exchangeId: Joi.string().custom(objectId),
  }),
};
module.exports = {
  createMtAccount,
  getMtAccount,
  getMtAccountById,
  updateMtAccount,
  deleteMtAccount,
  createMtBroker,
  getMtBroker,
  getMtBrokerById,
  updateMtBrokerById,
  deleteMtBroker,
};
