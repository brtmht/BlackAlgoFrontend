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

const searchUser = {
  body: Joi.object().keys({
    text: Joi.string(),
  }),
};
module.exports = {
  updateUser,
  searchUser,
};
