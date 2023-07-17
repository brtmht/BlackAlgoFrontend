const Joi = require('joi');
const { objectId } = require('./custom.validation');

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
  getSubscriptionPlans,
  getSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  requestSubscriptionPlan,
};
