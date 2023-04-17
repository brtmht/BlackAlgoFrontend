const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRegion = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

const getRegions = {
  query: Joi.object().keys({
    name: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRegion = {
  params: Joi.object().keys({
    regionId: Joi.string().custom(objectId),
  }),
};

const updateRegion = {
  params: Joi.object().keys({
    regionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteRegion = {
  params: Joi.object().keys({
    regionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRegion,
  getRegions,
  getRegion,
  updateRegion,
  deleteRegion,
};
