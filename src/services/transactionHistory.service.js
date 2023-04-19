const httpStatus = require('http-status');
const { TransactionHistory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} transaction
 * @returns {Object}
 */
// eslint-disable-next-line camelcase
const saveTransactionHistory = async (paymentData, reqData) => {
  const PaymentDetails = await TransactionHistory.findOne({ paymentDetailId: paymentData._id });
  if (!PaymentDetails) {
    const history = await TransactionHistory.create({
      userId: reqData.user._id,
      paymentDetailId: paymentData._id,
      paymentStatus: reqData.body.paymentStatus,
      stripeTransactionId: reqData.body.stripeTransactionId,
    });
    if (!history) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
    }
    return history;
  }
  const transactionHistory = await TransactionHistory.updateOne(
    { paymentDetailId: paymentData._id },
    {
      $set: {
        ...reqData.body,
      },
    }
  );
  return transactionHistory;
};
const getPaymentsById = async (id) => {
  const paymentHistory = await TransactionHistory.find({ userId: id });
  if (!paymentHistory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return paymentHistory;
};
module.exports = {
  saveTransactionHistory,
  getPaymentsById,
};
