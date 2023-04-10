/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  paymentDetailService,
  stripeAccountService,
  transactionHistoryService,
  cryptoAccountService,
} = require('../services');

// binanace API
const getBinance = catchAsync(async (req, res) => {
  const binanceData = await cryptoAccountService.getBinance();
  res.status(httpStatus.NO_CONTENT).send();
});
// post binanace

const postBinance = catchAsync(async (req, res) => {
  res.status(httpStatus.NO_CONTENT).send();
});
// stripe config
const getStripeConfig = catchAsync(async (req, res) => {
  const clientSecret = await stripeAccountService.configStripe();
  res.send({ clientSecret });
});
// stripe webhook controller
const stripeWebhook = catchAsync(async (req) => {
  const user = req.user._id;
  await stripeAccountService.stripeWebhook(req, user);
});
// create stripe payment Token
const createPayment = catchAsync(async (req, res) => {
  let paymentIntent;
  let user;
  // eslint-disable-next-line prefer-const
  // user = req.user._id;
  if (req.body.paymentType === 'card') {
    paymentIntent = await stripeAccountService.createStripePayment(req.body);
    res.send({ stripe_token: paymentIntent.client_secret });
  }
  if (req.body.paymentType === 'crypto') {
    paymentIntent = '';
    throw new ApiError(httpStatus.NOT_FOUND, 'This mode is not ready yet');
  }

  // if (paymentIntent) {
  //   const stripeData = await stripeAccountService.saveStripeAccount(paymentIntent, req.body, user);
  //   const stripePaymentDetail = await paymentDetailService.savePaymentDetails(paymentIntent, stripeData, req.body, user);
  // }
});

// save data in transaction table
const savePaymentDetails = catchAsync(async (req, res) => {
  const user = req.user._id;
  const PaymentDetails = await paymentDetailService.updatePaymentDetails(req.body, user);
  if (PaymentDetails) {
    await transactionHistoryService.saveTransactionHistory(PaymentDetails, user);
  }
  res.send(PaymentDetails);
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
  const user = req.user._id;
  const history = await transactionHistoryService.getPaymnetsById(user);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no history found');
  }
  return history;
});

module.exports = {
  stripeWebhook,
  getStripeConfig,
  getBinance,
  postBinance,
  createPayment,
  getPayment,
  getPaymentHistory,
  savePaymentDetails,
};
