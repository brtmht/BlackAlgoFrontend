const httpStatus = require('http-status');
const { PaymentDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} paymentData
 * @returns {Promise<>}
 */
// eslint-disable-next-line camelcase
const savePaymentDetails = async (paymentData, stripeData, reqData, user_id) => {
  const trasactionData = await PaymentDetail.create({
    userId: user_id,
    paymentToken: paymentData.paymentToken,
    stripeAccountId: stripeData.id,
  });
  if (!trasactionData) {
    throw new ApiError(httpStatus['201_MESSAGE'], 'transaction failed at details');
  }
  return trasactionData;
};

// To update payment details after a transaction is processed
const updatePaymentDetails = async (reqData) => {
  const uddatedPaymentDetails = await PaymentDetail.findByIdAndUpdate(reqData.paymentDetailId, {
    stripeTransactionId: reqData.transactionId,
    paymentStatus: reqData.paymentStatus,
  });
  if (!uddatedPaymentDetails) {
    throw new ApiError(httpStatus['100_MESSAGE'], 'the payment data cannot be updated');
  }
  return uddatedPaymentDetails;
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
