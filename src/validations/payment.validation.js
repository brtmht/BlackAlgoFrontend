const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string(),
    amount: Joi.number(),
    phone: Joi.string(),
    paymentType: Joi.string(),
    currency: Joi.string(),
  }),
};
const postPaymentDetails = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    amount: Joi.number(),
    cryptoId: Joi.string().custom(objectId),
    stripeAccountId: Joi.string().custom(objectId),
    paymentDetailId: Joi.string().custom(objectId),
    subscriptionPlanId: Joi.string(),
    transactionId: Joi.string(),
    paymentType: Joi.boolean(),
    paymentStatus: Joi.string(),
    paymentToken: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    portfolioAmount: Joi.number(),
  }),
};
const createSubscription = {
  body: Joi.object().keys({
    plan: Joi.string(),
  }),
};

const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

const getPaymentHistory = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
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
