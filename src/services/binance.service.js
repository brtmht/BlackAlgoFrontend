/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { encryptData, decryptData, encryptDataForBinance, decryptDataForBinance, compareEncryptedVal } = require('../middlewares/common');

const binancePayKey = process.env.BINANCE_PAY_KEY;
const binancePaySecret = process.env.BINANCE_PAY_SECRET_KEY;

const timestamp = Date.now();
const params = `timestamp=${timestamp}`;

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
      // await saveBinacePaymentDetails(user._id, response.data, reqData);
      return response.data;
    }
  } catch (error) {
    console.log(error,"------------------------test");
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
    return response;
  }
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
    return response;
  }
};

const CreateSimpleBinanceTradeOrder = async (userData, data, lots, exchangeName) => {
  try {
    let symbol;
    switch (exchangeName) {
      case 'Binance Global':
        symbol = data?.Symbol === 'BTCUSD' ? 'BTCUSDT' : data?.Symbol === 'ETHUSD' ? 'ETHUSDT' : data?.Symbol;
        break;
    }
    const apiKey = await decryptDataForBinance(userData.config.apiKey);
    const apiSecret = await decryptDataForBinance(userData.config.apiSecret);
    // const apiKey = '967798605d5e7c61adc53792b77df175e194fe09bf16e1d8bb58d678e76e6d7a';
    // const apiSecret = 'c9ce975608637f4f0e8b07abed1ebcc3331dca13131c933aa89df17b0b4e3e91';
    const binanceType = 'MARKET';
    let positionSide;
    const timestamp = Date.now();
    if (data?.Type === 'Buy') {
      positionSide = 'LONG';
    }
    if (data?.Type === 'Sell') {
      positionSide = 'SHORT';
    }
    const params = `symbol=${symbol.toUpperCase()}&side=${data?.Type.toUpperCase()}&type=${binanceType.toUpperCase()}&quantity=${lots}&timestamp=${timestamp}&recvWindow=5000&positionSide=${positionSide.toUpperCase()}`;
    const signature = crypto.createHmac('sha256', apiSecret.toString()).update(params).digest('hex');
    var config = {
      method: 'post',
      url: `https://testnet.binancefuture.com/fapi/v1/order?${params}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': apiKey,
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Binance trade order created successfully ', response.data);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data ? error?.response?.data.msg : error);
    return error?.response?.data ? error?.response?.data.msg : error;
  }
};

const CreateBinanceTradeOrderUsingStopLoss = async (userData, data, lots, exchangeName) => {
  try {
    let symbol;
    let type;
    let positionSide;
    const timestamp = Date.now();
    switch (exchangeName) {
      case 'Binance Global':
        symbol = data?.Symbol === 'BTCUSD' ? 'BTCUSDT' : data?.Symbol === 'ETHUSD' ? 'ETHUSDT' : data?.Symbol;
        break;
    }

    if (data?.Type === 'Buy') {
      type = 'SELL';
      positionSide = 'LONG';
    }

    if (data?.Type === 'Sell') {
      type = 'BUY';
      positionSide = 'SHORT';
    }
    const binanceType = 'STOP_MARKET';

    const params = `symbol=${symbol.toUpperCase()}&side=${type.toUpperCase()}&positionSide=${positionSide}&type=${binanceType.toUpperCase()}&quantity=${lots}&stopPrice=${
      data?.StopLoss
    }&recvWindow=5000&workingType=MARK_PRICE&closePosition=true&placeType=position&timestamp=${timestamp}`;

    const signature = crypto
      .createHmac('sha256', await decryptData(userData.config.apiSecret))
      .update(params)
      .digest('hex');

    console.log(
      `https://api.binance.com/fapi/v1/order?symbol${symbol.toUpperCase()}=&side=${type.toUpperCase()}&positionSide=${positionSide}&type=${binanceType.toUpperCase()}&quantity=${lots}&stopPrice=${
        data?.StopLoss
      }&workingType=MARK_PRICE&closePosition=true&placeType=position&timestamp=${timestamp}&signature=${signature}`
    );
    var config = {
      method: 'post',
      url: `https://testnet.binancefuture.com/fapi/v1/order?${params}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': await decryptDataForBinance(userData.config.apiKey),
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Binance stop loss trade order created successfully ', response.data);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data ? error?.response?.data.msg : error);
    return error?.response?.data ? error?.response?.data.msg : error;
  }
};

const CreateBinanceTradeOrderUsingTakeProfit = async (userData, data, lots, exchangeName) => {
  try {
    let symbol;
    let type;
    let positionSide;
    const timestamp = Date.now();
    switch (exchangeName) {
      case 'Binance Global':
        symbol = data?.Symbol === 'BTCUSD' ? 'BTCUSDT' : data?.Symbol === 'ETHUSD' ? 'ETHUSDT' : data?.Symbol;
        break;
    }

    if (data?.Type === 'Buy') {
      type = 'SELL';
      positionSide = 'LONG';
    }

    if (data?.Type === 'Sell') {
      type = 'BUY';
      positionSide = 'SHORT';
    }
    const binanceType = 'TAKE_PROFIT_MARKET';
    const params = `symbol=${symbol.toUpperCase()}&side=${type.toUpperCase()}&positionSide=${positionSide}&type=${binanceType.toUpperCase()}&quantity=${lots}&stopPrice=${
      data?.TakeProfit
    }&recvWindow=5000&workingType=MARK_PRICE&closePosition=true&placeType=position&timestamp=${timestamp}`;
    const signature = crypto
      .createHmac('sha256', await decryptData(userData.config.apiSecret))
      .update(params)
      .digest('hex');

    console.log(`https://api.binance.com/fapi/v1/order?${params}&signature=${signature}`);
    var config = {
      method: 'post',
      url: `https://testnet.binancefuture.com/fapi/v1/order?${params}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': await decryptDataForBinance(userData.config.apiKey),
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Binance take profit trade order created successfully ', response.data);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data ? error?.response?.data.msg : error);
    return error?.response?.data ? error?.response?.data.msg : error;
  }
};

const ModifyBinanceTradeOrder = async (data, lots, orderID, userData) => {
  try {
    const signature = crypto
      .createHmac('sha256', await decryptData(userData.config.apiSecret))
      .update(params)
      .digest('hex');

    var config = {
      method: 'post',
      url: `https://api.binance.com/fapi/v1/order?&orderId=${orderID}&symbol${data?.Symbol.toUpperCase()}=&side=${data?.Type.toUpperCase()}&quantity=${lots}&price=${
        data?.Price
      }&timestamp=${timestamp}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': await decryptDataForBinance(userData.config.apiKey),
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Binance trade order modified successfully ', response.data);
    return response.data;
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error));
  }
};

const CancelBinanceTradeOrder = async () => {
  try {
    const apiKey = '967798605d5e7c61adc53792b77df175e194fe09bf16e1d8bb58d678e76e6d7a';
    const apiSecret = 'c9ce975608637f4f0e8b07abed1ebcc3331dca13131c933aa89df17b0b4e3e91';
    const timestamp = Date.now();
    const params = `orderId=1136435759&origClientOrderId=654UINx6IMClICiywxuTxN&symbol=ETHUSDT&timestamp=${timestamp}`;
    const signature = crypto.createHmac('sha256', apiSecret).update(params).digest('hex');

    var config = {
      method: 'delete',
      url: `https://testnet.binancefuture.com/fapi/v1/order?${params}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': apiKey,
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Binance trade order closed successfully ', response.data);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data ? error?.response?.data.msg : error);
    return error?.response?.data ? error?.response?.data.msg : error;
  }
};

const GetBinanceBalance = async (data) => {
  console.log(data,"=---------------------------");
  const API_SECRET = await decryptDataForBinance(data.apiSecret);
  const API_KEY = await decryptDataForBinance(data.apiKey);
  // const API_SECRET = 'c9ce975608637f4f0e8b07abed1ebcc3331dca13131c933aa89df17b0b4e3e91';
  // const API_KEY = '967798605d5e7c61adc53792b77df175e194fe09bf16e1d8bb58d678e76e6d7a';
  const timestamp = Date.now();
  const params = `timestamp=${timestamp}&recvWindow=5000`;
  const signature = crypto.createHmac('sha256', API_SECRET).update(params).digest('hex');

  var config = {
    method: 'get',
    url: `https://testnet.binancefuture.com/fapi/v2/balance?timestamp=${timestamp}&recvWindow=5000&signature=${signature}`,
    headers: {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': API_KEY,
    },
  };
  const response = await axios(config);
  const binanceData = response.data;
  console.log(response,"=====================qwerty");
  // Find the asset with symbol "USDT"
  const usdtAsset = binanceData.find((asset) => asset.asset === 'USDT');
  if (usdtAsset) {
    const usdtBalance = parseFloat(usdtAsset.balance);
    const usdtCrossWalletBalance = parseFloat(usdtAsset.crossWalletBalance);
    const usdtAvailableBalance = parseFloat(usdtAsset.availableBalance);

    return { balance: usdtBalance, walletBalance: usdtCrossWalletBalance, availableBalance: usdtAvailableBalance };
  } else {
    console.log('USDT asset not found in the data.');
    console.log(error);
  }
};
const CloseBinanceTradeOrder = async (userData, data, lots, exchangeName) => {
  try {
    let symbol;
    let type;
    let positionSide;
    switch (exchangeName) {
      case 'Binance Global':
        symbol = data?.Symbol === 'BTCUSD' ? 'BTCUSDT' : data?.Symbol === 'ETHUSD' ? 'ETHUSDT' : data?.Symbol;
        break;
    }
    const apiKey = await decryptDataForBinance(userData.config.apiKey);
    const apiSecret = await decryptDataForBinance(userData.config.apiSecret);
    // const apiKey = '967798605d5e7c61adc53792b77df175e194fe09bf16e1d8bb58d678e76e6d7a';
    // const apiSecret = 'c9ce975608637f4f0e8b07abed1ebcc3331dca13131c933aa89df17b0b4e3e91';
    const binanceType = 'MARKET';

    const timestamp = Date.now();
    if (data?.Type === 'Buy') {
      type = 'SELL';
      positionSide = 'LONG';
    }
    if (data?.Type === 'Sell') {
      type = 'BUY';
      positionSide = 'SHORT';
    }
    const params = `symbol=${symbol.toUpperCase()}&side=${type.toUpperCase()}&type=${binanceType.toUpperCase()}&quantity=${lots}&placeType=position&timestamp=${timestamp}&recvWindow=5000&positionSide=${positionSide.toUpperCase()}`;
    const signature = crypto.createHmac('sha256', apiSecret.toString()).update(params).digest('hex');
    var config = {
      method: 'post',
      url: `https://testnet.binancefuture.com/fapi/v1/order?${params}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': apiKey,
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Binance trade order closed successfully ', response.data);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data ? error?.response?.data.msg : error);
    return error?.response?.data ? error?.response?.data.msg : error;
  }
};

const getBinanceOrder = async (data, order) => {
  try {
    const API_SECRET = await decryptDataForBinance(data.apiSecret);
    const API_KEY = await decryptDataForBinance(data.apiKey);
    const timestamp = Date.now();
    const params = `symbol=${order.symbol.toUpperCase()}&orderId=${
      order.orderId
    }&recvWindow=5000&timestamp=${timestamp}`;
    console.log(params);
    const signature = crypto.createHmac('sha256', API_SECRET).update(params).digest('hex');

    var config = {
      method: 'get',
      url: `https://testnet.binancefuture.com/fapi/v1/order?${params}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': API_KEY,
      },
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    logger.info('Get binance trade order successfully ', response.data);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data ? error?.response?.data.msg : error);
    return error?.response?.data ? error?.response?.data.msg : error;
  }
};

module.exports = {
  createBinancePayOrder,
  createBinanceContract,
  createBinancePayment,
  deactivateBinanceSubscription,
  CreateSimpleBinanceTradeOrder,
  GetBinanceBalance,
  // ModifyBinanceTradeOrder,
  CreateBinanceTradeOrderUsingStopLoss,
  CreateBinanceTradeOrderUsingTakeProfit,
  CancelBinanceTradeOrder,
  CloseBinanceTradeOrder,
  getBinanceOrder,
};
