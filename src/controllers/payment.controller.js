/* eslint-disable no-console */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentDetailService, stripeAccountService, transactionHistoryService } = require('../services');

// create stripe payment Token
const createPayment = catchAsync(async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req, '=======================');
  console.log(req.user, '==================user=====');
  if (req.body.paymentType === 'card') {
    const paymentIntent = await stripeAccountService.createStripePayment(req.body);
    res.send(paymentIntent);
  }
  if (req.body.paymentType === 'crypto') {
    throw new ApiError(httpStatus.NOT_FOUND, 'This mode is not ready yet');
  }
});

// get user payment detail
const getPayment = catchAsync(async (req, res) => {
  const payments = await paymentDetailService.getPayments(req.params.paymentDetailId);
  if (!payments) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subscriptionPlan not found');
  }
  res.send(payments);
});

// get user payment history
const getPaymentHistory = catchAsync(async (req) => {
  const history = await transactionHistoryService.getPaymnetsById(req.params.userId);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no history found');
  }
  return history;
});

module.exports = {
  createPayment,
  getPayment,
  getPaymentHistory,
};
