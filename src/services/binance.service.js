/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const httpStatus = require('http-status');
const { paymentDetailService } = require('.');
const ApiError = require('../utils/ApiError');

const binancePayKey = process.env.BINANCE_PAY_KEY;
const binancePaySecret = process.env.BINANCE_PAY_SECRET_KEY;

function generateNonce(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let nonce = '';

  for (let i = 1; i <= length; i++) {
    const pos = Math.floor(Math.random() * chars.length);
    const char = chars.charAt(pos);
    nonce += char;
  }

  return nonce;
}

const createBinancePayOrder = async (user, reqData) => {
  const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/v2/order';

  const nonce = generateNonce(32);
  const timestamp = Math.round(Date.now());
  let firstDeductTime = new Date();
  let intervalType;
  if (reqData.type === 'Monthly') {
    const currentMonth = firstDeductTime.getMonth();
    const nextMonth = currentMonth + 1;
    firstDeductTime.setMonth(nextMonth);
    firstDeductTime = Math.round(new Date(firstDeductTime));
    intervalType = 1;
  }
  if (reqData.type === 'Yearly') {
    const currentDate = new Date();
    const nextYear = currentDate.getFullYear() + 1;
    firstDeductTime.setYear(nextYear);
    firstDeductTime = Math.round(new Date(firstDeductTime));
    intervalType = 12;
  }
  const merchantdata = Math.floor(Math.random() * (9825382937292 - 982538) + 982538);
  const payload = {
    env: {
      terminalType: reqData.terminalType,
    },
    merchantTradeNo: merchantdata,
    orderAmount: reqData.orderAmount.toString(),
    currency: reqData.currency,
    goods: {
      goodsType: '02',
      goodsCategory: 'Z000',
      referenceGoodsId: user._id,
      goodsName: reqData.type,
    },
    directDebitContract: {
      merchantContractCode: nonce,
      serviceName: 'Tra Direct Debit',
      scenarioCode: 'Membership',
      singleUpperLimit: reqData.orderAmount.toString(),
      periodic: true,
      cycleDebitFixed: true,
      cycleType: 'MONTH',
      cycleValue: intervalType,
      firstDeductTime: firstDeductTime,
      merchantAccountNo: merchantdata,
    },
  };

  const jsonRequest = JSON.stringify(payload);
  const requestBody = `${timestamp}\n${nonce}\n${jsonRequest}\n`;

  const binancePayKey = process.env.BINANCE_PAY_KEY;
  const binancePaySecret = process.env.BINANCE_PAY_SECRET_KEY;

  const hmac = crypto.createHmac('sha512', binancePaySecret);
  hmac.update(requestBody);
  const signature = hmac.digest('hex').toUpperCase();

  const headers = {
    'Content-Type': 'application/json',
    'BinancePay-Timestamp': timestamp,
    'BinancePay-Nonce': nonce,
    'BinancePay-Certificate-SN': binancePayKey,
    'BinancePay-Signature': signature,
  };

  try {
    const response = await axios.post(endpoint, jsonRequest, { headers });
    if (response.data) {
      await paymentDetailService.saveBinacePaymentDetails(user._id, response.data, reqData);
      return response.data;
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.response.data.errorMessage, error.response.data.status);
  }
};

const generateSignature = (requestData) => {
  const requestBody = `${requestData.timestamp}\n${requestData.nonce}\n${requestData.jsonRequest}\n`;
  const hmac = crypto.createHmac('sha512', binancePaySecret);
  hmac.update(requestBody);
  return hmac.digest('hex').toUpperCase();
};
const callBinancePayAPI = async (endpoint, requestData) => {
  const headers = {
    'Content-Type': 'application/json',
    'BinancePay-Timestamp': requestData.timestamp,
    'BinancePay-Nonce': requestData.nonce,
    'BinancePay-Certificate-SN': binancePayKey,
    'BinancePay-Signature': generateSignature(requestData, binancePaySecret),
  };

  try {
    const response = await axios.post(endpoint, requestData.jsonRequest, { headers });
    return response.data;
  } catch (error) {
    return error;
  }
};
const createBinanceContract = async (user, reqData) => {
  const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/direct-debit/contract';
  const nonce = generateNonce(32);
  const timestamp = Date.now();
  const firstDeductTime = timestamp + 10 * 24 * 60 * 60 * 1000;
  const payload = {
    merchantContractCode: nonce,
    serviceName: 'Tra Direct Debit',
    scenarioCode: 'Membership',
    currency: reqData.currency,
    singleUpperLimit: reqData.orderAmount,
    periodic: true,
    cycleDebitFixed: true,
    cycleType: 'MONTH',
    cycleValue: 12,
    firstDeductTime: firstDeductTime,
    merchantAccountNo: user.email,
  };
  const jsonRequest = JSON.stringify(payload);

  const requestData = { timestamp, nonce, jsonRequest };

  const response = await callBinancePayAPI(endpoint, requestData);

  if (response) {
    //await paymentDetailService.saveBinacePaymentDetails(userId, response, reqData);
    return response;
  }
};

const getSubscriptionById = async (subscriptionId) => {
  return subscriptionId;
};
/**
 * Delete trade by id
 * @param {ObjectId} subscriptionId
 * @returns {Promise<Subscription>}
 */
const deactivateBinanceSubscription = async (subscriptionId, merchantContractCode) => {
  const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/direct-debit/contract/termination';
  const nonce = generateNonce(32);
  const timestamp = Math.round(Date.now());
  const payload = {
    merchantContractCode,
  };

  const jsonRequest = JSON.stringify(payload);
  const requestData = { timestamp, nonce, jsonRequest };

  const response = await callBinancePayAPI(endpoint, requestData);

  try {
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.response.data.errorMessage, error.response.data.status);
  }
  // if (response) {
  //   await UserExchangeConfig.findByIdAndUpdate(subscriptionId, { subscriptionStatus: false });
  //   return response;
  // }
};

const createBinancePayment = async (userId, reqData) => {
  const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/pay/apply';
  const nonce = generateNonce(32);
  const timestamp = Math.round(Date.now());
  const payload = {
    // subMerchantId: 123,
    merchantRequestId: reqData.merchantId,
    tradeMode: 'DIRECT_DEBIT',
    bizId: reqData.contractId,
    productName: 'test payment',
    amount: reqData.orderAmount,
    currency: 'USDT',
    // webhookUrl: 'https://abc.com',  in case this is sent the webhook url on merchant plateform will not work.
  };
  const jsonRequest = JSON.stringify(payload);

  const requestData = { timestamp, nonce, jsonRequest };
  const response = await callBinancePayAPI(endpoint, requestData);
  if (response) {
    // await paymentDetailService.saveBinacePaymentDetails(userId, response, reqData);
    return response;
  }
};

module.exports = {
  createBinancePayOrder,
  createBinanceContract,
  createBinancePayment,
  deactivateBinanceSubscription,
};
