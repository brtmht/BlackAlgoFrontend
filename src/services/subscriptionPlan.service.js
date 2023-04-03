/* eslint-disable import/order */
const httpStatus = require('http-status');
const { SubscriptionPlan } = require('../models');
const ApiError = require('../utils/ApiError');
const Stripe = require('stripe')(process.env.STRIPE_KEY);

/**
 * Create a subscriptionPlan
 * @param {Object} subscriptionPlanBody
 * @returns {Promise<SubscriptionPlan>}
 */
const createSubscriptionPlan = async (subsPlanData) => {
  const subscriptionPlan = await Stripe.subscriptions.create({
    // eslint-disable-next-line prettier/prettier
    customer: subsPlanData.customerId,
    items: [{ price: subsPlanData.productId }],
  });
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }

  return subscriptionPlan;
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
  createSubscriptionPlan,
  retrieveSubsPlan,
  deactivateSubscription,
  resumeSubscription,
  getAllSubsPlans,
  updateSubscriptionPlanById,
};
