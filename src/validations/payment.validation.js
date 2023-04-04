const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    country: Joi.string(),
    amount: Joi.number(),
    phone: Joi.string(),
    paymentType: Joi.string(),
    currency: Joi.string(),
  }),
};
const postPaymentDetails = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    cryptoId: Joi.string().custom(objectId),
    stripeAccountId: Joi.string().custom(objectId),
    paymentDetailsId: Joi.string().custom(objectId),
    subscriptionPlanId: Joi.string().custom(objectId),
    paymentTrasactionId: Joi.string(),
    paymentType: Joi.boolean(),
    paymentStatus: Joi.boolean(),
  }),
};
const createSubscription = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    address: Joi.string(),
    phone: Joi.string(),
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
};

module.exports = {
  createPayment,
  getPayment,
  getPaymentHistory,
  createSubscription,
  postPaymentDetails,
};
