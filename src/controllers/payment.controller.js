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
  userExchangeConfig,
} = require('../services');
const PaymentDetail = require('../models/paymentDetail.model');

// binanace API
const getBinance = catchAsync(async (req, res) => {
  const binanceData = await binanceService.createBinancePayOrder();
  res.send(binanceData);
});
// post binanace
const postBinance = catchAsync(async (req, res) => {
  const binanceData = await binanceService.createBinancePayOrderNew();
  res.send(binanceData);
});
// // log in binance
const binanceWebhook = catchAsync(async (req, res) => {
  console.log(req.body,"===========req.body");
  console.log(req.query,"===========req.query");
  console.log(req.param,"===========req.param");
  res.send();
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
    res.send({
      success: true,
      code: 201,
      message: 'stripe token created Successfully',
      data: { stripe_token: paymentData.paymentIntent.client_secret },
    });
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
    await userExchangeConfig.updateConnectionData(user);
  }
  res.send({ success: true, code: 201, message: 'payment Successfully', data: PaymentDetails });
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
  binanceWebhook,
  createPayment,
  getPayment,
  getPaymentHistory,
  savePaymentDetails,
};
