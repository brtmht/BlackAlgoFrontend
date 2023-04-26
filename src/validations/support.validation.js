const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSupport = {
  body: Joi.object().keys({
    name: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    message: Joi.string(),
  }),
};

const getSupports = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateSupport = {
  params: Joi.object().keys({
    supportId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      from: Joi.string(),
      receiverId: Joi.string(),
      status: Joi.boolean(),
    })
    .min(1),
};

const deleteSupport = {
  params: Joi.object().keys({
    supportId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSupport,
  getSupports,
  updateSupport,
  deleteSupport,
};
