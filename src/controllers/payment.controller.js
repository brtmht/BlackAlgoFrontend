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
  userExchangeConfig,
  subscriptionPlanService,
} = require('../services');
const PaymentDetail = require('../models/paymentDetail.model');
const {createBinancePayOrder} = require('../services/binance.service');
const mt4Server = require('../middlewares/mt4Server');

// binanace API
const getPaymentById = catchAsync(async (req, res) => {
  const PaymentDetails = await paymentDetailService.getPaymentByuserID(req.user._id, req.body.paymentDetailId);
  if(PaymentDetails){
    res.send({ success: true, code: 201, message: 'data get Successfully', data: PaymentDetails });
  }else{
    throw new ApiError(httpStatus.NOT_FOUND, 'data not found');
  }
  
});
// post binanace
const postBinance = catchAsync(async (req, res) => {
  const binanceData = await createBinancePayOrder(req.user._id, req.body);
  res.send(binanceData);
});
// // log in binance
const binanceWebhook = catchAsync(async (req, res) => {
  if (req.body) {
    if (req.body.bizType === 'PAY') {
      if (req.body.bizStatus === 'PAY_SUCCESS') {
        await transactionHistoryService.saveBinanceTransactionHistory(req.body);
        const PaymentDetails = await paymentDetailService.getPaymentByToken(req.body.bizIdStr);
        const payment = await paymentDetailService.getStripePayment(PaymentDetails.userId,req.body.bizIdStr);
        const cryptoAccount = await cryptoAccountService.saveBinancePayment(req.body);
        // const userConfig = await userExchangeConfig.getUserExchangeConfigByUserId(PaymentDetails.userId);
        // if(!userConfig){
            await userExchangeConfig.updateBinanceSubscription(PaymentDetails.userId);  
        // }
        if (payment) {
          if(payment && payment.paymentStatus === 'success' && (payment?.subscriptionPlanId !== null || payment?.subscriptionPlanId !== undefined || !empty(payment?.subscriptionPlanId))){
            await subscriptionPlanService.deactivateStripeSubscription(payment.subscriptionPlanId); 
           }
        }
        //else{ 
        //   const userConfig = await userExchangeConfig.getUserExchangeConfigByUserId(PaymentDetails.userId);
        //   if(userConfig){
        //       await userExchangeConfig.activeConnection(PaymentDetails.userId);
        //   }
        // }
       
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

    if (req.body.bizType === 'DIRECT_DEBIT_CT') {
      if (req.body.bizStatus === 'CONTRACT_SIGNED') {
        const payData = JSON.parse(req.body.data);
        await cryptoAccountService.saveBinanceContract(req.body);
        const transactionDetails = await transactionHistoryService.getPaymentsByMerchantTrade(payData.merchantAccountNo);
        
        if (transactionDetails) {
           await userExchangeConfig.activeSubscription(transactionDetails.userId); 
           await  paymentDetailService.updateBinanceSubscription(transactionDetails,req.body.bizIdStr);  
        }
       emitData('BinanceContractResponse', { success: true, code: 201, message: 'contract created Successfully', data: transactionDetails });

      }
      if (req.body.bizStatus === 'CONTRACT_TERMINATED') {
        const payData = JSON.parse(req.body.data);
        await cryptoAccountService.UpdatedTerminatedContract(req.body);
        const transactionDetails = await transactionHistoryService.getPaymentsByMerchantTrade(payData.merchantAccountNo);
        await userExchangeConfig.disconnectSubscription(transactionDetails.userId,'user',payData.contractTerminationTime);
       emitData('BinanceContractResponse', { success: false, error_code: 400, message: 'Transaction Failed', data: transactionDetails });
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
  console.log(req.body.paymentType,"--------------------------");
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
      data: { stripe_token: paymentData.paymentIntent.client_secret, paymnet_intent_id: paymentData.paymentIntent.id },
    });
  }
  if (req.body.paymentType === 'crypto') {
    const binanceData = await createBinancePayOrder(req.user, req.body);
    if (binanceData.status === 'SUCCESS') {
      await paymentDetailService.saveBinacePaymentDetails(user,binanceData, req.body);
      await userExchangeConfig.updateBinanceSubscriptionData(user,Date.now());
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

const upgradeSubscriptionPlanPayment = catchAsync(async (req, res) => {
  if (req.body.paymentType === 'crypto') {
    const binanceData = await createBinancePayOrder(req.user, req.body);
    if (binanceData.status === 'SUCCESS') {
      await paymentDetailService.saveBinacePaymentDetails(req.user._id,binanceData, req.body);
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



module.exports = {
  stripeWebhook,
  getStripeConfig,
  postBinance,
  binanceWebhook,
  createPayment,
  getPayment,
  getPaymentHistory,
  savePaymentDetails,
  upgradeSubscriptionPlanPayment,
  getPaymentById,
};
