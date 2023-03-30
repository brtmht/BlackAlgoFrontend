const httpStatus = require('http-status');
const { TransactionHistyory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {string} id
 * @returns {Object}
 */
const getPaymnetsById = async (id) => {
  const history =await TransactionHistyory.findById(id)
  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return history;
};

module.exports = {
  getPaymnetsById
};
