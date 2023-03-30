const httpStatus = require('http-status');
const { PaymentDetail } = require('../models');
const ApiError = require('../utils/ApiError');
const { stripeAccountService } = require('./stripeAccount.service');

/**
 * Create a subscriptionPlan
 * @param {Object} paymentBody
 * @returns {Promise<>}
 */
const createPaymentService = async (paymentBody) => {

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
  createPaymentService,
  getPayments,
};
