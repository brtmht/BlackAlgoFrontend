const httpStatus = require('http-status');
const axios = require('axios');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

const apiKey = '6odkw4accsafuk7taitr6hlsn4088cthahozgkeuydza7rpl0xdksspxbt11lyso';
const apiSecret = 'skrgrvjah6lyz9sy3tebygtxfd5skxgdci1rno0zjqacdijgecuafgm6tj8viqfg';
const axiosInstance = axios.create({
  baseURL: `https://bpay.binanceapi.com`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// function generateSignature(payload, timestamp, nonce) {
//   const query = Object.keys(payload)
//     .sort()
//     .map((key) => `${key}=${encodeURIComponent(payload[key])}`)
//     .join('&');
//   const signaturePayload = `${query}&timestamp=${timestamp}&nonce=${nonce}`;
//   const signature = crypto.createHmac('sha256', apiSecret).update(signaturePayload).digest('hex');
//   return signature;
// }

function nonce(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

/**
 * Create a strategy
 * @param {Object} strategyBody
 * @returns {Promise<Strategy>}
 */
const createBinancePayOrder = async () => {
  try {
    const timestamp = Date.now();

    const payload = {
      env: {
        terminalType: 'WEB',
      },
      orderTags: {
        ifProfitSharing: true,
      },
      merchantTradeNo: '9825382937292',
      orderAmount: 25.17,
      currency: 'USDT',
      description: 'very good Ice Cream',
      goodsDetails: [
        {
          goodsType: '01',
          goodsCategory: 'D000',
          referenceGoodsId: '7876763A3B',
          goodsName: 'Ice Cream',
          goodsDetail: 'Greentea ice cream cone',
        },
      ],
    };
    // {
    //   totalFee: '10.00',
    //   asset: 'USDT',
    //   orderId: 'ORDER123',
    //   returnUrl: 'https://yourwebsite.com/return',
    //   userId: 'USER123',
    //   userEmail: 'user@example.com',
    //   userName: 'John Doe',
    //   walletType: 'spot',
    // };

    const newPayload = `${timestamp}\n${nonce(32)}\n${payload}\n`;
    const newSignature = crypto.createHmac('sha256', apiSecret).update(newPayload).digest('hex');

    console.log(newSignature, '++++++++++++++newSignature+++++++++++++');

    const headers = {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce('32'),
      'BinancePay-Certificate-SN': apiKey,
      'BinancePay-Signature': newSignature,
    };
    const response = await axiosInstance.post('https://bpay.binanceapi.com/binancepay/openapi/v3/order', payload, {
      headers,
    });
    if (!response) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

const createBinancePayOrderNew = async () => {
  try {
    const timestamp = Date.now();

    const payload = {
      env: {
        terminalType: 'WEB',
      },
      orderTags: {
        ifProfitSharing: true,
      },
      merchantTradeNo: '9825382937292',
      orderAmount: 25.17,
      currency: 'USDT',
      description: 'very good Ice Cream',
      goodsDetails: [
        {
          goodsType: '01',
          goodsCategory: 'D000',
          referenceGoodsId: '7876763A3B',
          goodsName: 'Ice Cream',
          goodsDetail: 'Greentea ice cream cone',
        },
      ],
    };
    const newPayload = `${timestamp}\n${nonce(32)}\n${payload}\n`;
    const newSignature = crypto.createHmac('sha256', apiSecret).update(newPayload).digest('hex');

    console.log(newSignature, '++++++++++++++newSignature+++++++++++++');

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bpay.binanceapi.com/binancepay/openapi/order',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce('32'),
        'BinancePay-Certificate-SN': apiKey,
        'BinancePay-Signature': newSignature,
      },
      data: JSON.stringify(payload),
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data),"---------------------------");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    return error;
  }
};

module.exports = {
  createBinancePayOrder,
  createBinancePayOrderNew,
};
