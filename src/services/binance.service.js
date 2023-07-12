/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');

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

// const createBinancePayOrder = async () => {
//   try {
//     const timestamp = Math.round(Date.now());

//     const requestData = {
//       env: {
//         terminalType: 'WEB',
//       },
//       // orderTags: {
//       //   ifProfitSharing: true,
//       // },
//       merchantTradeNo: '9825382937292',
//       orderAmount: 25.17,
//       currency: 'USDT',
//       description: 'very good Ice Cream',
//       goods: [
//         {
//           goodsType: '01',
//           goodsCategory: 'D000',
//           referenceGoodsId: '7876763A3B',
//           goodsName: 'Ice Cream',
//           goodsDetail: 'Greentea ice cream cone',
//         },
//       ],
//     };
//     console.log(nonce, '-----------nonce');
//     const payload = `${timestamp}\n${nonce}\n${requestData}\n`;
//     console.log(payload, '++++++++++++++newPayload+++++++++++++');
//     // const newSignature = crypto.HmacSHA512(newPayload, apiSecret).toString(crypto.enc.Hex).toUpperCase();
//     const hmac = crypto.createHmac('sha512', apiSecret);
//     hmac.update(payload);
//     const signature = hmac.digest('hex').toUpperCase();
//     console.log(signature, '++++++++++++++newSignature+++++++++++++');

//     const headers = {
//       'Content-Type': 'application/json',
//       'BinancePay-Timestamp': timestamp,
//       'BinancePay-Nonce': nonce,
//       'BinancePay-Certificate-SN': apiKey,
//       'BinancePay-Signature': signature,
//     };
//     const response = await axiosInstance.post('https://bpay.binanceapi.com/binancepay/openapi/order', payload, {
//       headers,
//     });
//     if (!response) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
//     }
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

// const createBinancePayOrderNew = async () => {
//   try {
//     const timestamp = Math.round(Date.now());

//     const requestData = {
//       env: {
//         terminalType: 'WEB',
//       },
//       merchantTradeNo: Math.floor(Math.random() * (9825382937292 - 982538) + 982538),
//       orderAmount: 25.17,
//       currency: 'USDT',
//       goods: {
//         goodsType: '01',
//         goodsCategory: 'D000',
//         referenceGoodsId: '7876763A3B',
//         goodsName: 'Ice Cream',
//         goodsDetail: 'Greentea ice cream cone',
//       },
//     };
//     const nonce = generateNonce(32);
//     const jsonRequest = JSON.stringify(requestData);
//     const payload = `${timestamp}\n${nonce}\n${jsonRequest}\n`;
//     const hmac = crypto.createHmac('sha512', apiSecret);
//     hmac.update(payload);
//     const signature = hmac.digest('hex').toUpperCase();

//     const config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://bpay.binanceapi.com/binancepay/openapi/v2/order',
//       headers: {
//         'Content-Type': 'application/json',
//         'BinancePay-Timestamp': timestamp,
//         'BinancePay-Nonce': nonce,
//         'BinancePay-Certificate-SN': apiKey,
//         'BinancePay-Signature': signature,
//       },
//       data: payload,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data), '---------------------------');
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } catch (error) {
//     return error;
//   }
// };

const createBinancePayOrder = async () => {
  const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/v2/order';

  const nonce = generateNonce(32);
  const timestamp = Math.round(Date.now());
  const payload = {
    env: {
      terminalType: 'WEB',
    },
    merchantTradeNo: Math.floor(Math.random() * (9825382937292 - 982538) + 982538),
    orderAmount: 25.17,
    currency: 'USDT',
    goods: {
      goodsType: '01',
      goodsCategory: 'D000',
      referenceGoodsId: '7876763A3B',
      goodsName: 'Ice Cream',
      goodsDetail: 'Greentea ice cream cone',
    },
  };

  const jsonRequest = JSON.stringify(payload);
  const requestBody = `${timestamp}\n${nonce}\n${jsonRequest}\n`;

  const binancePayKey = '6odkw4accsafuk7taitr6hlsn4088cthahozgkeuydza7rpl0xdksspxbt11lyso';
  const binancePaySecret = 'skrgrvjah6lyz9sy3tebygtxfd5skxgdci1rno0zjqacdijgecuafgm6tj8viqfg';

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
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  createBinancePayOrder,
};
