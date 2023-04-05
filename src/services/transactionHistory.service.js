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
    transactionId: transaction.transactionId,
  });
  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return history;
};

module.exports = {
  saveTransactionHistory,
};
