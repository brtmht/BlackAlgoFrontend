const httpStatus = require('http-status');
const { TransactionHistory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} transaction
 * @returns {Object}
 */
// eslint-disable-next-line camelcase
const saveTransactionHistory = async (transaction, user_id) => {
  const history = await TransactionHistory.create({
    userId: user_id,
    paymentDetailId: transaction.id,
    paymentStatus: transaction.paymentStatus,
    stripeTransactionId: transaction.stripeTransactionId,
  });
  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return history;
};
const getPaymnetsById = async (id) => {
  const paymentHistory = await TransactionHistory.findById({ userId: id });
  if (!paymentHistory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return paymentHistory;
};
module.exports = {
  saveTransactionHistory,
  getPaymnetsById,
};
