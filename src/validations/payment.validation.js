const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    country:Joi.string(),
    phone:Joi.string(),
    paymentType:Joi.string()
  }),
};


const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

const getPaymentHistory = {
    query: Joi.object().keys({
      paymentId: Joi.string().custom(objectId),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  }

module.exports = {
    createPayment,
    getPayment,
    getPaymentHistory
};
