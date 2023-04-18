const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    title: Joi.string(),
    message: Joi.string(),
    token: Joi.string(),
    type: Joi.string(),
    isRead: Joi.boolean(),
    isDeleted: Joi.boolean(),
  }),
};

module.exports = {
  createNotification,
};
