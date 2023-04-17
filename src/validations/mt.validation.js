const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMtAccount = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    name: Joi.string().required(),
    login: Joi.number(),
    password: Joi.string(),
    server: Joi.string(),
    type: Joi.string(),
    baseCurrency: Joi.string(),
    copyFactoryRoles: Joi.string(),
    connectionStatus: Joi.string(),
    manualTrading: Joi.boolean(),
    region: Joi.string(),
    reliability: Joi.string(),
    resourceSlot: Joi.number(),
    isdeleted: Joi.boolean(),
    status: Joi.boolean(),
  }),
};

const getMtAccount = {
  params: Joi.object().keys({
    mtAccountId: Joi.string(),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMtAccountUsingId = {
  query: Joi.object().keys({
    mtAccountId: Joi.string(),
  }),
};

const updateMtAccount = {
  params: Joi.object().keys({
    mtAccountId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      server: Joi.string(),
      type: Joi.string(),
      baseCurrency: Joi.string(),
      copyFactoryRoles: Joi.boolean(),
      connectionStatus: Joi.string(),
      manualTrading: Joi.boolean(),
      region: Joi.string(),
      reliaability: Joi.string(),
      resourceSlot: Joi.string(),
      isDeleted: Joi.boolean(),
      status: Joi.boolean(),
    })
    .min(1),
};

const deleteMtAccount = {
  params: Joi.object().keys({
    mtAccountId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      isDeleted: Joi.boolean(),
    })
    .min(1),
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

const getMtBrokerUsingId = {
  params: Joi.object().keys({
    mtBrokerId: Joi.string(),
  }),
};

const updateMtBrokerById = {
  params: Joi.object().keys({
    mtBrokerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
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
    brokerId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      isDeleted: Joi.boolean(),
    })
    .min(1),
};
module.exports = {
  createMtAccount,
  getMtAccount,
  getMtAccountUsingId,
  updateMtAccount,
  deleteMtAccount,
  createMtBroker,
  getMtBroker,
  getMtBrokerUsingId,
  updateMtBrokerById,
  deleteMtBroker,
};
