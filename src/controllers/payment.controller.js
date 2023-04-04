const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentDetailService, stripeAccountService, transactionHistoryService } = require('../services');

// create stripe payment Token
const createPayment = catchAsync(async (req, res) => {
  let paymentIntent;
  let user;
  // eslint-disable-next-line prefer-const
  user = req.user._id;
  if (req.body.paymentType === 'card') {
    paymentIntent = await stripeAccountService.createStripePayment(req.body);
    res.send(paymentIntent);
  }
  if (req.body.paymentType === 'crypto') {
    paymentIntent = '';
    throw new ApiError(httpStatus.NOT_FOUND, 'This mode is not ready yet');
  }

  if (paymentIntent) {
    const stripeDataDb = stripeAccountService.saveStripeAccount(paymentIntent, req.body, user);
  }
});
// create New Api
// userid,paymentdetailid, payment status, paymentTransactionid

// save data in transaction table
const makePayment = catchAsync(async (req, res) => {
  const user = req.user._id;
  const transaction = await paymentDetailService.makeTransaction(req.body, user);
  if (!transaction) {
    throw new ApiError(httpStatus['201_MESSAGE'], 'no transaction to save ');
  } else {
    const transactionHistory = await transactionHistoryService.postHistory(transaction, user);
    res.send(transaction, transactionHistory);
  }
});

// get user payment detail
const getPayment = catchAsync(async (req, res) => {
  const payments = await paymentDetailService.getPayments(req.user._id);
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
  makePayment,
};
