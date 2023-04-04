const httpStatus = require('http-status');
const { TransactionHistyory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} transaction
 * @returns {Object}
 */
const saveTransactionHistory = async (transaction, user) => {
  const history = await TransactionHistyory.create({
    userId: user,
    paymentDetailId: transaction._id,
    paymmentStatus: transaction.paymentStatus,
    transactionId: transaction.id,
  });
  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return history;
};

module.exports = {
  saveTransactionHistory,
};
