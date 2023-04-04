const httpStatus = require('http-status');
const { PaymentDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} paymentBody
 * @returns {Promise<>}
 */
const makeTransaction = async (paymentBody, user) => {
  const trasactionData = await PaymentDetail.create({
    userId: user,
    stripeAccountId: paymentBody.stripeAccountId,
    SubscriptionPlanId: paymentBody.subscriptionPlanId,
    paymentStatus: paymentBody.status,
  });
  if (!trasactionData) {
    throw new ApiError(httpStatus['201_MESSAGE'], 'transaction failed at details');
  }
  return trasactionData;
};

/**
 * Get subscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getPayments = async (id) => {
  return PaymentDetail.findById(id);
};

module.exports = {
  makeTransaction,
  getPayments,
};
