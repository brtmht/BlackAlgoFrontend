/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const { paymentDetailService } = require('.');

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

const createBinancePayOrder = async (userId,reqData) => {
  const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/v2/order';

  const nonce = generateNonce(32);
  const timestamp = Math.round(Date.now());
  const payload = {
    env: {
      terminalType: reqData.terminalType,
    },
    merchantTradeNo: Math.floor(Math.random() * (9825382937292 - 982538) + 982538),
    orderAmount: reqData.orderAmount,
    currency: reqData.currency,
    goods: {
      goodsType: '02',
      goodsCategory: 'Z000',
      referenceGoodsId: userId,
      goodsName: reqData.type,
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
    if(response.data){
      console.log("-----------------",response.data);
      await paymentDetailService.saveBinacePaymentDetails(userId,response.data,reqData);
      return response.data;
    }
    
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  createBinancePayOrder,
};
