const Joi = require('joi');

const updateUser = {
  query: Joi.object().keys({
    userId: Joi.string(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    strategy: Joi.string().allow(''),
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
