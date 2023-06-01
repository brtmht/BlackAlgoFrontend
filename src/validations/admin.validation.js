const Joi = require('joi');

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object().keys({
    email: Joi.string(),
    name: Joi.string(),
    isDeleted: Joi.boolean(),
    isBlocked: Joi.boolean(),
  }),
};

module.exports = {
  updateUser,
};
