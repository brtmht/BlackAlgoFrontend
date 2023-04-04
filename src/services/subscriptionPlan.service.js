/* eslint-disable import/order */
const httpStatus = require('http-status');
const { SubscriptionPlan } = require('../models');
const ApiError = require('../utils/ApiError');
const Stripe = require('stripe')(process.env.STRIPE_KEY);

/**
 * Create a subscriptionPlan
 * @param {Object} subsPlanData
 * @returns {Object}
 */
const createSubscription = async () => {
  const product = await Stripe.products.create({ name: 'Basic Dashboard' });

  const price = await Stripe.prices.create({
    unit_amount: 750,
    currency: 'usd',
    recurring: { interval: 'month' },
    product: product.id,
  });

  const subscription = await Stripe.subscriptions.create({
    customer: 'cus_Ne4uaFQ5WoQiaK',
    items: [{ price: price.id }],
  });
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }

  return subscription;
};
// It will retrieve subscription plan
const retrieveSubsPlan = async (subsPlanData) => {
  const subscriptionPlan = await Stripe.subscriptions.retrieve(subsPlanData.subsPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscriptionPlan;
};

// It will resume the subscription plan with subscription id
const resumeSubscription = async (subsPlanData) => {
  const subscription = await Stripe.subscriptions.retrieve(subsPlanData.subsPlanId, { billing_cycle_anchor: 'now' });
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscription;
};

// It will need subscription plan id to cancel subscription plan
const deactivateSubscription = async (subsPlanData) => {
  const subscription = await Stripe.subscriptions.del(subsPlanData.subsPlanId);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscription;
};

const getAllSubsPlans = async () => {
  const subscriptions = await Stripe.subscriptions.list({
    limit: 3,
  });
  if (!subscriptions) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscriptions;
};
/**
 * Get subscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getSubscriptionPlanById = async (id) => {
  return SubscriptionPlan.findById(id);
};

/**
 * Update subscriptionPlan by id
 * @param {ObjectId} subscriptionPlanId
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateSubscriptionPlanById = async (subscriptionPlanId, updateBody) => {
  const subscriptionPlan = await getSubscriptionPlanById(subscriptionPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  if (updateBody.name && (await SubscriptionPlan.isNameTaken(updateBody.name, subscriptionPlanId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(subscriptionPlan, updateBody);
  await subscriptionPlan.save();
  return subscriptionPlan;
};

module.exports = {
  createSubscription,
  retrieveSubsPlan,
  deactivateSubscription,
  resumeSubscription,
  getAllSubsPlans,
  updateSubscriptionPlanById,
};
