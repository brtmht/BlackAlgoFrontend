const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subscriptionPlanService } = require('../services');

// Create subscription plans with stripe
const createSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.createSubscription(req.body);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus['402_MESSAGE']);
  }
  res.status(httpStatus.CREATED).send();
});

// Stripe Apis
const getSubscriptionPlans = catchAsync(async (req, res) => {
  const result = await subscriptionPlanService.getAllStripeSubsPlans(req);
  res.send(result);
});

// you can retrieve a subscription plan by using subscription id from stripe
const retrieveSubscriptionPlan = catchAsync(async (req, res) => {
  const retrieval = await subscriptionPlanService.retrieveStripeSubsPlan(req.body);
  if (!retrieval) {
    throw new ApiError(httpStatus.BAD_REQUEST);
  }
  res.send(retrieval);
});

const deactivateSubscriptionPlan = catchAsync(async (req, res) => {
  const deactivatedSuscription = await subscriptionPlanService.deactivateStripeSubscription(req.body);
  if (!deactivatedSuscription) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED);
  }
  res.status(httpStatus.ACCEPTED);
});

// db apis
const getAllSubscriptionPlans = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.getAllSubscriptionPlans();
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.BAD_REQUEST);
  }
  res.send(subscriptionPlan);
});
const getSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.getSubscriptionPlanById(req.params.subscriptionPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.BAD_REQUEST);
  }
  res.send(subscriptionPlan);
});
const updateSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.updateSubscriptionPlanById(req.params.subscriptionPlanId, req.body);
  res.send(subscriptionPlan);
});

const deleteSubscriptionPlan = catchAsync(async (req, res) => {
  await subscriptionPlanService.deleteSubscriptionPlanById(req.params.subscriptionPlanId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  retrieveSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  deactivateSubscriptionPlan,
  getSubscriptionPlan,
  getAllSubscriptionPlans,
};
