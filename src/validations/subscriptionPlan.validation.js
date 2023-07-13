const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubscriptionPlan = {
  body: Joi.object().keys({
    name: Joi.string(),
    planName: Joi.string(),
    email: Joi.string().email(),
    address: Joi.string(),
    description: Joi.string(),
    amount: Joi.number(),
    phone: Joi.string(),
    currency: Joi.string(),
    paymentType: Joi.string(),
    min_portfolio_size: Joi.number(),
    max_portfolio_size: Joi.number(),
    plan: Joi.string(),
  }),
};

const getSubscriptionPlans = {
  query: Joi.object().keys({
    subscriptionPlanId: Joi.string(),
    description: Joi.string(),
    amount: Joi.number(),
    min_portfolio_size: Joi.number(),
    max_portfolio_size: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSubscriptionPlan = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.string(),
  }),
};

const updateSubscriptionPlan = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteSubscriptionPlan = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.string().custom(objectId),
  }),
};

const requestSubscriptionPlan = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phoneNo: Joi.number(),
  }),
};
module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  requestSubscriptionPlan,
};
