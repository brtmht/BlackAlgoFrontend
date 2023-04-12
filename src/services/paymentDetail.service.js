const httpStatus = require('http-status');
const { PaymentDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} paymentData
 * @returns {Promise<>}
 */
// eslint-disable-next-line camelcase
const savePaymentDetails = async (paymentData, stripeData, reqData) => {
  const trasactionData = await PaymentDetail.create({
    userId: stripeData.user_id,
    paymentToken: paymentData.paymentIntent.client_secret,
    stripeAccountId: stripeData.id,
    subscriptionPlanId: reqData.subscriptionplanId,
  });
  if (!trasactionData) {
    throw new ApiError(httpStatus['201_MESSAGE'], 'transaction failed at details');
  }
  return trasactionData;
};

// To update payment details after a transaction is processed
const updatePaymentDetails = async (reqData) => {
  const udatedPaymentDetails = await PaymentDetail.updateOne(
    { paymentToken: reqData.paymentToken },
    {
      $set: {
        paymentStatus: reqData.paymentStatus,
      },
    }
  );
  if (!udatedPaymentDetails) {
    throw new ApiError(httpStatus['100_MESSAGE'], 'the payment data cannot be updated');
  }
  return udatedPaymentDetails;
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
  savePaymentDetails,
  getPayments,
  updatePaymentDetails,
};
