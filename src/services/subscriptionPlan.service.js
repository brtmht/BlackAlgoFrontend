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
const createSubscription = async (subscriptionData) => {
  const product = await Stripe.products.create({ name: subscriptionData.name });
  const price = await Stripe.prices.create({
    unit_amount: subscriptionData.amount * 100,
    currency: 'usd',
    recurring: { interval: 'month' },
    product: product.id,
  });

  // eslint-disable-next-line no-unused-vars
  // const card = await Stripe.customers.retrieveSource(subscriptionData.customerId, subscriptionData.cardId);
  const paymentM = await Stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 2,
      exp_year: 2027,
      cvc: '123',
    },
  });
  // eslint-disable-next-line no-unused-vars
  const paymentMethod = await Stripe.paymentMethods.attach(paymentM.id, { customer: 'cus_Nh4zE9WTN76s40' });
  const subscription = await Stripe.subscriptions.create({
    collection_method: 'send_invoice',
    days_until_due: 30,
    customer: 'cus_Nh4zE9WTN76s40',
    items: [{ price: price.id }],
  });
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  } else {
    const subscriptionPlan = await SubscriptionPlan.create({
      subscriptionPlanId: subscription.id,
      name: subscriptionData.name,
      amount: subscriptionData.amount,
      min_portfolio_size: subscriptionData.min_portfolio_size,
      max_portfolio_size: subscriptionData.max_portfolio_size,
    });
    return subscriptionPlan;
  }
};

// Stripe services
// It will retrieve subscription plan
const retrieveStripeSubsPlan = async (subsPlanData) => {
  const subscriptionPlan = await Stripe.subscriptions.retrieve(subsPlanData.subscriptionId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscriptionPlan;
};

// It will need subscription plan id to cancel subscription plan
const deactivateStripeSubscription = async (subsPlanData) => {
  const subscription = await Stripe.subscriptions.del(subsPlanData.subscriptionId);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscription;
};

// It will resume the subscription plan with subscription id
const resumeStripeSubscription = async (subsPlanData) => {
  const subscription = await Stripe.subscriptions.retrieve(subsPlanData.subsPlanId, { billing_cycle_anchor: 'now' });
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscription;
};

// List all the subscriptionplans from stripe
const getAllStripeSubsPlans = async () => {
  const subscriptions = await Stripe.subscriptions.list({
    limit: 3,
  });
  if (!subscriptions) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscriptions;
};
// db services
/**
 * Get subscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const findSubscriptionPlanById = async (id) => {
  return SubscriptionPlan.findById(id);
};

/**
 * Update subscriptionPlan by id
 * @param {ObjectId} subscriptionPlanId
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateSubscriptionPlanById = async (subscriptionPlanId, updateBody) => {
  const subscriptionPlan = await findSubscriptionPlanById(subscriptionPlanId);
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
// Get subscription plan by id
const getSubscriptionPlanById = async (id) => {
  const subscriptionPlan = await findSubscriptionPlanById(id);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return subscriptionPlan;
};
// Get all subscriptionPlans from db
const getAllSubscriptionPlans = async () => {
  const allPlans = await SubscriptionPlan.find({});
  if (!allPlans) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  return allPlans;
};
// Delete subscription plan by id
const deleteSubscriptionPlanById = async (subscriptionPlanId) => {
  const subscriptionPlan = await findSubscriptionPlanById(subscriptionPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  await subscriptionPlan.remove();
  return subscriptionPlan;
};
module.exports = {
  createSubscription,
  retrieveStripeSubsPlan,
  deactivateStripeSubscription,
  resumeStripeSubscription,
  getAllStripeSubsPlans,
  getSubscriptionPlanById,
  getAllSubscriptionPlans,
  updateSubscriptionPlanById,
  deleteSubscriptionPlanById,
};
