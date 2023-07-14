/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { emitData } = require('../socket');
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
  // const binanceData = await binanceService.createBinancePayOrder(req.user._id, req.body);
  res.send();
});
// post binanace
const postBinance = catchAsync(async (req, res) => {
  const binanceData = await binanceService.createBinancePayOrder(req.user._id, req.body);
  console.log(binanceData, '==============binanceData');
  res.send(binanceData);
});
// // log in binance
const binanceWebhook = catchAsync(async (req, res) => {
  console.log(req.body, '===========req.body');
  if (req.body) {
    if (req.body.bizType === 'PAY') {
      if (req.body.bizStatus === 'PAY_SUCCESS') {
        await transactionHistoryService.saveBinanceTransactionHistory(req.body);
        const PaymentDetails = await paymentDetailService.getPaymentByToken(req.body.bizIdStr);
        emitData('BinancePayResponse', { success: true, code: 201, message: 'payment Successfully', data: PaymentDetails });

      }
      if (req.body.bizStatus === 'PAY_CLOSED') {
        await paymentDetailService.updateBinancePaymentDetails(req.body);
        const PaymentDetails = await paymentDetailService.getPaymentByToken(req.body.bizIdStr);
        emitData('BinancePayResponse', { success: false, error_code: 400, message: 'Transaction Failed', data: PaymentDetails });
      }
      res.send({
        returnCode: 'SUCCESS',
        returnMessage: null,
      });
    }
  }
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
  // let paymentData;
  const user = req.user._id;
  if (req.body.paymentType !== 'crypto' && req.body.paymentType !== 'card') {
    res.send({ success: false, error_code: 403, message: 'payment type not valid' });
  }
  if (req.body.paymentType === 'card') {
    const paymentData = await stripeAccountService.createStripePayment(req.body, user);
    if (paymentData) {
      const stripePaymentDetail = await paymentDetailService.savePaymentDetails(
        paymentData,
        paymentData.stripeData,
        req.body
      );
    }
    res.send({
      success: true,
      code: 201,
      message: 'crypto order created Successfully',
      data: { stripe_token: paymentData.paymentIntent.client_secret },
    });
  }
  if (req.body.paymentType === 'crypto') {
    const binanceData = await binanceService.createBinancePayOrder(req.user._id, req.body);
    if (binanceData.status === 'SUCCESS') {
      res.send({
        success: true,
        code: 201,
        message: 'stripe token created Successfully',
        data: { BinanceData: binanceData },
      });
    } else {
      res.send({ success: false, error_code: 400, message: 'Something wrong' });
    }
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
