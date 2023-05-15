/* eslint-disable no-console */ /* eslint-disable prettier/prettier */
const Binance = require('node-binance-api');
const https = require('https');
// binance
// eslint-disable-next-line no-unused-vars
// binance
// const binanceKeys = new Binance().options({
//   APIKEY: 'TC5R07Eye0JZmDeDzinPPWoU17eoR0LdQaD6KQXyO96zhsffZCeHiDhXk6BWUb7X',
//   APISECRET: 'zFqAPcJsSjvr8QkvS7Fu73d1jmDywHdOYlYtB97pcY4uaI3Gsxe3OmJL0dz5zN3m',
//   family: 0,
// });
// connecting with test keys
// const binanceKeys = new Binance().options({
//   APIKEY: 'y0xB9FbuIF8Aq35DuF6MsEiDvKNAH1lKSYBYwIogxQflyaB6Ut1VItVSE4EKcWS5',
//   APISECRET: 'V4hTdgL6HFlVZPV9i4vqPNPKVCz6Yk9QsvdpqMTthGpjMYrHAFT2goYTrQXL4JbI',
//   family: 0,
// });
// binance with live keys
// eslint-disable-next-line no-unused-vars

const binanceKeys = new Binance().options({
  APIKEY: 'W3C4ni3VJXskaYA9aAUDX7bJeocCQr9K0Oe2nhqM4UfbGdJj99krPwhMmUcK6WV9',
  APISECRET: 'mFhQq8p6Bm47E7ZEbaSRi0LN01PWReXIXDyZ90dsoJbGov3VeLUVYZb03gEov8EB',
  family: 0,
});

const binanceAutoConnect = async () => {
  console.log('binance connecting');
  // const responseType = 'code';
  // const clientId = 'TC5R07Eye0JZmDeDzinPPWoU17eoR0LdQaD6KQXyO96zhsffZCeHiDhXk6BWUb7X';
  // // const redirectUri = 'https%3A%2F%2Fdev.blackalgo.com%2Fv1%2Fbinance';
  // const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fv1%2Fbinance';
  // const csrfToken = user._id;
  // const scope = user:email,user:address;
  //  const testUri = `http%3A%2F%2Flocalhost%3A4000%2Fcompletion`
  // new_client id = ue8Htp0VEg
  // old client id = wpKNiPLtNG
  // const apiUrl = `https://accounts.binance.com/en/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=account%3Astatus%2Ccreate%3Aapikey%2Cuser%3AopenId%2Cuser%3Aemail`;
  // eslint-disable-next-line no-unused-vars
  const apiUrlTest = `https://accounts.binance.com/sapi/v1/broker/subAccount`;
  // const apiUrl = `https://accounts.binance.com/en/oauth/authorize?response_type=code&client_id=ue8Htp0VEg&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fv1%2Fbinance&scope=account%3Astatus%2Ccreate%3Aapikey%2Cuser%3AopenId%2Cuser%3Aemail`;
  https
    .get(apiUrlTest, (response) => {
      // let data = '';
      console.log('------------>>>>>>>>>>>>', response);
      // response.on('data', (chunk) => {
      //   data += chunk;
      // });
      // response.on('end', () => {
      //   // eslint-disable-next-line no-console
      //   // console.log("------------>>>>>>>>>>>>",data);
      //   return data;
      // });
    })
    .on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('------------+++++++++++++++++', error);
    });
};

const loginBinanceManually = async (reqData) => {
  const binance = new Binance().options({
    APIKEY: reqData.apiBinanceKey,
    APISECRET: reqData.binanceSecret,
  });

  return binance;
};
// Get 24hr ticker price change statistics for all symbols
const get24hrPrice = async () => {
  binanceKeys.prevDay(false, (error, prevDay) => {
    // console.info(prevDay); // view all data
    // eslint-disable-next-line no-restricted-syntax
    for (const obj of prevDay) {
      const { symbol } = obj;
      console.info(`${symbol} volume:${obj.volume} change: ${obj.priceChangePercent}%`);
    }
  });
};

// Price and ask services
const getAskPrice = async () => {
  binanceKeys.bookTickers('BNBBTC', (error, ticker) => {
    console.info('bookTickers', ticker);
  });
};

const getLatestPrice = async () => {
  const ticker = await binanceKeys.prices();
  console.info(`Price of IDEXUSDT: ${ticker.IDEXUSDT}`);
};

const getMarketDepth = async () => {
  binanceKeys.depth('BNBBTC', (error, depth, symbol) => {
    console.info(`${symbol} market depth`, depth);
  });
};

// Testing Done
const getBalances = async () => {
 await binanceKeys.balance((error, balances) => {
  if ( error ) return console.error(error);
  console.info("balances()", balances);
  console.info("ETH balance: ", balances.USDT.available);
  return balances;
});
};
const priceOfAllSymbols = async () => {
  const ticker = await binanceKeys.prices();
  console.info({ ...ticker });
  console.info(`Price of BNB: ${ticker.BNBUSDT}`);
  return `${ticker.BNBUSDT} USD`;
};
// Palcing order services
const placeOrder = async () => {
  try {
    const order = await binanceKeys.order({
      symbol: 'BNBUSDT',
      side: 'BUY',
      quantity: 0.00000000067,
      price: 350,
    });
    console.log('Order placed successfully:', order);
  } catch (error) {
    console.error('Error placing order:', error);
  }
};
// limit order
const placeLimitOrder = async () => {
  const quantity = 0.000022;
  const price = 0.069;
  const response = await binanceKeys.buy('ETHBTC', quantity, price);
  const response1 = binanceKeys.sell('ETHBTC', quantity, price);
  console.log(response, response1);
};
// limit order with a callback
const placeCallbackOrder = async () => {
  const quantity = 0.01;
  const price = 0.0040203;
  binanceKeys.buy('BNBETH', quantity, price, { type: 'LIMIT' }, (error, response) => {
    console.log(`error inorder`, error);
    console.info('Limit Buy response', response);
    console.info(`order id: ${response.orderId}`);
  });
};
// OCO chaining order
const placeChainingOrder = async () => {
  const quantity = 1;
  binanceKeys.marketBuy('BNBBTC', quantity, (error, response) => {
    console.info('Market Buy response', response);
    console.info(`order id: ${response.orderId}`);
    // Now you can limit sell with a stop loss, etc.
  });
};
// Take Profit- Stop loss order
// When the stop is reached, a stop order becomes a market order
// Note: You must also pass one of these type parameters:
// STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT
const placeProfitLossOrder = async () => {
  const type = 'STOP_LOSS';
  const quantity = 1;
  const price = 0.069;
  const stopPrice = 0.068;
  binanceKeys.sell('ETHBTC', quantity, price, { stopPrice, type });
};
// const placeIcebergOrder to hide quantity
// Iceberg orders are intended to conceal the order quantity.
const placeIcebergOrder = async () => {
  const quantity = 1;
  const price = 0.069;
  binanceKeys.sell('ETHBTC', quantity, price, { icebergQty: 10 });
};
// market order
const placeMarketOrder = async () => {
  const quantity = 1;
  const response = await binanceKeys.marketBuy('BNBBTC', quantity, (error, orderStatus, symbol) => {
    console.info(`${symbol}  market order status:`, orderStatus);
    console.log(error.body, '--------?>?>?>')
    return { symbol, orderStatus };
  });
  // const response = await binanceKeys.marketBUY('ETHBTC', quantity);
  console.log(response);
  return response;
};
const getOrderStatus = async (orderId) => {
  binanceKeys.orderStatus('ETHBTC', orderId, (error, orderStatus, symbol) => {
    console.info(`${symbol} order status:`, orderStatus);
    return { symbol, orderStatus };
  });
};
const cancelOrder = async (orderId) => {
  binanceKeys.cancel('ETHBTC', orderId, (error, response, symbol) => {
    console.info(`${symbol} cancel response:`, response);
    return response;
  });
};
const cancelAllOrder = async () => {
  try {
    const canceled = await binanceKeys.cancelAll('XMRBTC');
    console.log(canceled);
  } catch (error) {
    console.error('Error placing order:', error);
    console.log('Reason for error:', error.body);
  }
  // console.info(await binanceKeys.cancelAll('XMRBTC'));
};
const getAllOrders = async () => {
 await binanceKeys.allOrders('IDEXUSDT', (error, orders, symbol) => {
    if (error) return console.error('=========>', error.body);
    console.info(`${symbol} orders:`, orders);
    return orders;
  });
};
const getOnlyOpenOrders = async () => {
  binanceKeys.openOrders(false, (error, openOrders) => {
    console.info('openOrders', openOrders);
    return openOrders;
  });
};
const getTradeHistory = async () => {
  binanceKeys.trades('IDEXUSDT', (error, trades, symbol) => {
    console.log(trades, symbol);
    return { trades, symbol };
  });
};
async function getSwapHistory() {
  try {
    const swaps = await binanceKeys.sapi.getAssetDividend();
    console.log(swaps);
  } catch (err) {
    console.error(err);
  }
}
// Deposit & Withdraw
// Get Depoist address
const getDepositAddress = async () => {
  binanceKeys.depositAddress('XMR', (error, response) => {
    console.info(response);
  });
};
// Get all deposit's records
const getDepositAllHistory = async () => {
  binanceKeys.depositHistory((error, response) => {
    console.info(error);

    console.info(response);
  });
};
// Get Deposit History for a specific symbol
const getDepositHistoryForASymbol = async () => {
  binanceKeys.depositHistory((error, response) => {
    console.info(response);
  }, 'VEN');
};
// Get withdraw history
const getWithdraw = async () => {
  binanceKeys.withdrawHistory((error, response) => {
    console.info(response);
  }, 'BTC');
};
const getAllWithdraw = async () => {
  binanceKeys.withdrawHistory((error, response) => {
    console.info(response);
  });
};
const getWithdrawWithAddress = async () => {
  // Required for coins like XMR, XRP, etc.
  const address = '44tLjmXrQNrWJ5NBsEj2R77ZBEgDa3fEe9GLpSf2FRmhexPvfYDUAB7EXX1Hdb3aMQ9FLqdJ56yaAhiXoRsceGJCRS3Jxkn';
  const addressTag = '0e5e38a01058dbf64e53a4333a5acf98e0d5feb8e523d32e3186c664a9c762c1';
  const amount = 0.1;
  binanceKeys.withdraw('XMR', address, amount, addressTag);
};
const makeWithdraw = async () => {
  binanceKeys.withdraw('BTC', '1C5gqLRs96Xq4V2ZZAR1347yUCpHie7sa', 0.2);
};

// web socket
const webSocketData = () => {
  binanceKeys.websockets.chart('BNBBTC', '1m', (symbol, interval, chart) => {
    const tick = binanceKeys.last(chart);
    const last = chart[tick].close;
    console.info(chart);
    // Optionally convert 'chart' object to array:
    // let ohlc = binanceKeys.ohlc(chart);
    // console.info(symbol, ohlc);
    console.info(`${symbol} last price: ${last}`);
  });
};
// const candleStickDataForSymbol = () => {
//   // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
// binanceKeys.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {
//   console.info("candlesticks()", ticks);
//   const lastTick = ticks[ticks.length - 1];
//   const [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = lastTick;
//   console.info(`${symbol} last close: ${close}`);
// }, {limit: 500, endTime: 1514764800000});
// }
module.exports = {
  binanceAutoConnect,
  loginBinanceManually,
  // Get 24hr price
  get24hrPrice,
  // Price and ask
  getSwapHistory,
  getLatestPrice,
  getAskPrice,
  getMarketDepth,
  priceOfAllSymbols,
  getBalances,
  // Orders
  placeOrder,
  placeLimitOrder,
  placeCallbackOrder,
  placeChainingOrder,
  placeProfitLossOrder,
  placeIcebergOrder,
  placeMarketOrder,
  getOrderStatus,
  cancelOrder,
  cancelAllOrder,
  getAllOrders,
  getOnlyOpenOrders,
  getTradeHistory,
  // Deposit & Withdraw
  getDepositAddress,
  getDepositAllHistory,
  getDepositHistoryForASymbol,
  getWithdraw,
  getAllWithdraw,
  getWithdrawWithAddress,
  makeWithdraw,
  // Candle Stick
  // candleStickDataForSymbol,
  // Web Sockect
  webSocketData,
};
