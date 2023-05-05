/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  paymentDetailService,
  stripeAccountService,
  transactionHistoryService,
  cryptoAccountService,
  binanceService,
} = require('../services');
const PaymentDetail = require('../models/paymentDetail.model');
const { binance, loginBinanceManually } = require('../services/binance.service');

// binanace API
const getBinance = catchAsync(async (req, res) => {
  const binanceData = await binanceService.getAllOrders();
  res.send(binanceData);
});
// post binanace
const postBinance = catchAsync(async (req, res) => {
  const binanceData = await binanceService.placeMarketOrder();
  res.send(binanceData);
});
// log in binance
const loginBinance = catchAsync(async (req, res) => {
  const result = await binanceService.loginBinanceManually(req.body);
  res.send(result);
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
  let paymentData;
  const user = req.user._id;

  if (req.body.paymentType === 'card') {
    paymentData = await stripeAccountService.createStripePayment(req.body, user);
    res.send({ stripe_token: paymentData.paymentIntent.client_secret });
  }
  if (req.body.paymentType === 'crypto') {
    paymentData = '';
    throw new ApiError(httpStatus.NOT_FOUND, 'This mode is not ready yet');
  }
  if (paymentData) {
    const stripePaymentDetail = await paymentDetailService.savePaymentDetails(paymentData, paymentData.stripeData, req.body);
  }
});

// save data in transaction table
const savePaymentDetails = catchAsync(async (req, res) => {
  const user = req.user._id;
  await paymentDetailService.updatePaymentDetails(req.body, user);
  const PaymentDetails = await PaymentDetail.findOne({ paymentToken: req.body.paymentToken });
  if (PaymentDetails) {
    await transactionHistoryService.saveTransactionHistory(PaymentDetails, req);
    // await stripeAccountService.updateStripeAccount(PaymentDetails.stripeAccountId, req.body.customerCardId);
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
const getPaymentHistory = catchAsync(async (req, res) => {
  const user = req.user._id;
  const history = await transactionHistoryService.getPaymentsById(user);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no history found');
  }
  res.send(history);
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
  loginBinance,
};
