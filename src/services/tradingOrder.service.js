const httpStatus = require('http-status');
const { TradingOrder } = require('../models');
const ApiError = require('../utils/ApiError');
const mt4Server = require('../middlewares/mt4Server');
const { getUserExchangeConfigByUserId, updateServerTokenById } = require('./userExchangeConfig.service');
const moment = require('moment');
const { getExchangeById } = require('./exchange.service');
const { GetBinanceBalance } = require('./binance.service');

const convertISOString = async (timestamp) => {
const date = new Date(timestamp);
const openTime = date.toISOString();
return openTime;
};
/**
 * Create a TradingOrder
 * @param {Object} tradingOrderBody
 * @returns {Promise<TradingOrder>}
 */
const createTradingOrder = async (tradingOrderBody, userId, masterData, orderType, walletBalance) => {
  let tradingData;
  if (tradingOrderBody) {
    tradingData = {
      userId,
      masterTicketId: masterData.Ticket,
      ticketId: tradingOrderBody.ticket,
      copiedTo: 'MT4',
      openTime: tradingOrderBody.openTime,
      closeTime: tradingOrderBody.closeTime,
      expiration: tradingOrderBody.expiration,
      operation: tradingOrderBody.type,
      lots: tradingOrderBody.lots,
      symbol: tradingOrderBody.symbol,
      openPrice: tradingOrderBody.openPrice,
      stopLoss: tradingOrderBody.stopLoss,
      takeProfit: tradingOrderBody.takeProfit,
      closePrice: tradingOrderBody.closePrice,
      magic: tradingOrderBody.magicNumber,
      swap: tradingOrderBody.swap,
      commission: tradingOrderBody.commission,
      comment: tradingOrderBody.comment,
      profit: tradingOrderBody.profit,
      openRate: tradingOrderBody.rateOpen,
      closeRate: tradingOrderBody.rateClose,
      digits: tradingOrderBody.ex.digits,
      volume: tradingOrderBody.ex.volume,
      state: tradingOrderBody.ex.state,
      reason: tradingOrderBody.reason,
      storage: tradingOrderBody.ex.storage,
      taxes: tradingOrderBody.ex.taxes,
      activation: tradingOrderBody.ex.activation,
      marginRate: tradingOrderBody.rateMargin,
      orderType: orderType,
      balance: walletBalance,
    };
  }
  return TradingOrder.create(tradingData);
};

const createBinanceTradingOrder = async (tradingOrder, userId, masterData, orderType, walletBalance) => {
  let tradingData;
  const time = await convertISOString(tradingOrder.time);
  if (tradingOrder) {
    tradingData = {
      userId,
      masterTicketId: masterData.Ticket,
      ticketId: tradingOrder.orderId,
      copiedTo: 'Binance',
      openTime: await convertISOString(tradingOrder.time),
      lotPrice: tradingOrder.cumQuote,
      operation: tradingOrder.side.charAt(0) + tradingOrder.side.slice(1).toLowerCase(),
      lots: tradingOrder.executedQty,
      symbol: tradingOrder.symbol,
      openPrice: tradingOrder.avgPrice,
      closePrice: tradingOrder.avgPrice,
      orderType: orderType,
      balance: walletBalance,
    };
  }
  return TradingOrder.create(tradingData);
};

/**
 * Get tradingOrder by userId
 * @param {ObjectId} userId
 * @returns {Promise<TradingOrder>}
 */
const getTradingOderByID = async (_id) => {
  const tradingOrder = await TradingOrder.findOne({ _id });
  if (!tradingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  return tradingOrder;
};

/**
 * Check if MasterTicket id is exist
 * @param {string} masterTicketId - The trading Master Ticket id
 */
const checkMasterTradingId = async (masterTicketId, user_id) => {
  const data = await TradingOrder.findOne({ masterTicketId, userId: user_id });
  return data;
};


const checkAllMasterTradingId = async (masterTicketId, user_id) => {
  const data = await TradingOrder.find({ masterTicketId, userId: user_id });
  return data;
};

/**
 * Get Trading orders count by userId
 * @param {string} masterTicketId - The trading Master Ticket id
 */
const getTradeOrderCount = async (user_id) => {
  const count = await TradingOrder.countDocuments({ userId: user_id });
  return count;
};

/**
 * Get Trading orders with pagination by userId
 */
const getAllTradingOrderWithPagination = async (userId, options) => {
  const skipCount = (options.page - 1) * options.limit;
  const tradingOrderCount = await TradingOrder.find({ userId });
  const tradeCount = await getTradeOrderCount(userId);
  const tradingOrders = await TradingOrder.find({ userId }).sort({ createdAt: -1 }).skip(skipCount).limit(options.limit);
  if (tradingOrders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  return {
    tradingOrders,
    page: options.page,
    pageLimit: options.limit,
    hasNextData: tradingOrderCount.length > options.page * options.limit,
    totalCount: tradeCount,
  };
};

/**
 * Update trade oder data on the bases of ticket id
 * @param {string} masterTicketId - The trading masterTicketId
 */
const updateTradeOrderByMasterTicket = async (ticketId, data, orderType) => {
  const updateOrder = await TradingOrder.findOneAndUpdate(
    { ticketId: data.ticket },
    {
      $set: {
        masterTicketId: ticketId,
        ticketId: data.ticket,
        copiedTo: 'MT4',
        openTime: data.openTime,
        closeTime: data.closeTime,
        expiration: data.expiration,
        operation: data.type,
        lots: data.lots,
        symbol: data.symbol,
        openPrice: data.openPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        closePrice: data.closePrice,
        magic: data.magicNumber,
        swap: data.swap,
        commission: data.commission,
        comment: data.comment,
        profit: data.profit,
        openRate: data.rateOpen,
        closeRate: data.rateClose,
        digits: data.digits,
        volume: data.volume,
        state: data.state,
        reason: data.reason,
        storage: data.storage,
        taxes: data.taxes,
        activation: data.activation,
        marginRate: data.rateMargin,
        orderType: orderType,
      },
    }
  );
  if (!updateOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  const updatedTradingOrder = await TradingOrder.findOne({ ticketId: data.ticket });

  return updatedTradingOrder;
};

/**
 * Update trade order lots data on the bases of ticket id
 * @param {string} masterTicketId - The trading masterTicketId
 */
const updateTradeOrderLots = async (ticketId, lots) => {
  const updateOrder = await TradingOrder.findOneAndUpdate(
    { ticketId: ticketId },
    {
      $set: {
        lots: lots,
      },
    }
  );
  if (!updateOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  return updateOrder;
};

/**
 * Update trade order comment data on the bases of ticket id
 * @param {string} masterTicketId - The trading masterTicketId
 */
const updateTradeOrderType = async (ticketId, userId, orderType) => {
  const updateOrder = await TradingOrder.findOneAndUpdate(
    { masterTicketId: ticketId, userId },
    {
      $set: {
        orderType,
      },
    }
  );
  if (!updateOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  return updateOrder;
};

/**
 * Create a TradingOrder
 * @param {Object} tradingOrderBody
 * @returns {Promise<TradingOrder>}
 */
const updateTradingOrder = async (updateBody, id) => {
  const updatedOrder = await TradingOrder.findByIdAndUpdate(id, { ...updateBody });
  if (!updatedOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return updatedOrder;
};

/**
 * Create a TradingOrder
 * @param {Object} tradingOrderBody
 * @returns {Promise<TradingOrder>}
 */
const deleteTradingOrderById = async (id) => {
  const deletedUser = await TradingOrder.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isDelete: true,
      },
    }
  );
  if (!deletedUser) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
};

/**
 * Get Graph order trade history
 * @param {Object} orderData
 * @returns {Promise<TradingOrder>}
 */
const getGraphTradeOrder = async (orderData, id) => {
  const { step } = orderData;
  let ordersList;

  switch (step) {
    case '24hr':
      const TwentyHourAgo = new Date(orderData.timestamp - 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
        createdAt: { $gte: TwentyHourAgo },
      }).sort({ updatedAt: 1 }).exec();
      break;
    case '1hr':
      const oneHourAgo = new Date(orderData.timestamp - 1 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
        createdAt: { $gt: oneHourAgo },
      }).sort({ updatedAt: 1 }).exec();
      break;
    case '7day':
      const sevenDaysAgo = new Date(orderData.timestamp - 7 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
        createdAt: { $gte: sevenDaysAgo },
      }).sort({ updatedAt: 1 }).exec();
      break;
    case '30day':
      const thirtyDaysAgo = new Date(orderData.timestamp - 30 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
        createdAt: { $gte: thirtyDaysAgo },
      }).sort({ updatedAt: 1 }).exec();
      break;
    case '90day':
      const ninetyDaysAgo = new Date(orderData.timestamp - 90 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
        createdAt: { $gte: ninetyDaysAgo },
      }).sort({ updatedAt: 1 }).exec();
      break;
    case '1year':
      const oneYearAgo = new Date(orderData.timestamp - 365 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
        createdAt: { $gte: oneYearAgo },
      }).sort({ updatedAt: 1 }).exec();
      break;
    case 'all':
      ordersList = await TradingOrder.find({
        userId: id,
        orderType: 'closeOrder',
      }).sort({ updatedAt: 1 }).exec();
      break;
    default:
      ordersList;
      break;
  }
  return ordersList;
};

const getPortfolioValue = async (userId) => {
  try {
    const userConfig = await getUserExchangeConfigByUserId(userId);
    let portfolioSize;
    if (userConfig) {
      const exchangeData = await getExchangeById(userConfig.exchangeId);
      if(exchangeData.type === 'Binance'){
        portfolioSize = await GetBinanceBalance(userConfig.config);
      }else{
        let BrokerToken;
        const checkConnection = await mt4Server.checkConnection(userConfig.serverToken);
        let connectionAttempts = 0;
  
        if (checkConnection?.message) {
          const maxAttempts = 3;
          const ipList = await mt4Server.getServerDataForIps(userConfig.config.server);
  
          for (const ip of ipList) {
            if (connectionAttempts >= maxAttempts) {
              break;
            }
  
            let IP;
            let PORT;
            const [address, port] = ip.split(':');
  
            if (port) {
              IP = address;
              PORT = port;
            } else {
              IP = ip;
              PORT = '443';
            }
  
            const response = await mt4Server.connect(userConfig, IP, PORT);
            console.log('action: new mt4 token generated');
            if (!response.message) {
              await updateServerTokenById(userConfig.id, response);
              BrokerToken = response;
              break;
            } else {
              connectionAttempts++;
            }
          }
        } else {
          BrokerToken = userConfig.serverToken;
        }
        portfolioSize = await mt4Server.accountSummary(BrokerToken); // Use BrokerToken here
      }
      return {portfolioSize:portfolioSize.balance.toFixed(2)};
    }
  } catch (error) {
    console.error('Error in getPortfolioValue:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error in getPortfolioValue');
  }
};

const calculateProfitLoss = async (userId) => {
  try {
    const userConfig = await getUserExchangeConfigByUserId(userId);

    if (userConfig) {
      // Fetch all trading orders for the user using Promise.all
      const tradingOrders = await TradingOrder.find({ userId });
      if (tradingOrders.length === 0) {
        return { cumulativeProfitLoss: 0, profitLoss: 0, tradeData: tradingOrders};
      }
      // Calculate the cumulative profit or loss concurrently
      const cumulativeProfitLoss = await Promise.all(tradingOrders.map((order) => order.profit)).then((profits) =>
        profits.reduce((sum, profit) => sum + profit, 0)
      );

      if (cumulativeProfitLoss) {
        // Determine if it's a profit or loss
        const isProfit = cumulativeProfitLoss >= 0;
        const sign = isProfit ? '+' : '-';

        // Calculate the profit or loss percentage
        const initialBalance = userConfig.walletAmount;
        const lastTradingOrder = tradingOrders[tradingOrders.length - 1];
        const currentBalance = lastTradingOrder.balance;
        const totalProfitLoss = currentBalance - initialBalance;
        const profitLossPercentage = (totalProfitLoss / initialBalance) * 100;

        const cumulativeProfitLossString = sign + Math.abs(cumulativeProfitLoss).toFixed(2);

        return { cumulativeProfitLoss: cumulativeProfitLossString, profitLoss: totalProfitLoss.toFixed(2), tradeData: tradingOrders };
      } else {
        return { cumulativeProfitLoss: 0, profitLoss: 0, tradeData: tradingOrders };
      }
    }
  } catch (error) {
    console.error('Error in calculateCumulativeProfitLoss:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error calculating cumulative profit/loss');
  }
};

const calculateTodayPerformance = async (userId) => {
  try {
    const userConfig = await getUserExchangeConfigByUserId(userId);
    if (userConfig) {
      let portfolioSize;
      const exchangeData = await getExchangeById(userConfig.exchangeId);
      if(exchangeData.type === 'Binance'){
        portfolioSize = await GetBinanceBalance(userConfig.config);
      }
      else{
        let BrokerToken;
        const checkConnection = await mt4Server.checkConnection(userConfig.serverToken);
        let connectionAttempts = 0;
  
        if (checkConnection?.message) {
          const maxAttempts = 3;
          const ipList = await mt4Server.getServerDataForIps(userConfig.config.server);
  
          for (const ip of ipList) {
            if (connectionAttempts >= maxAttempts) {
              break;
            }
  
            let IP;
            let PORT;
            const [address, port] = ip.split(':');
  
            if (port) {
              IP = address;
              PORT = port;
            } else {
              IP = ip;
              PORT = '443';
            }
  
            const response = await mt4Server.connect(userConfig, IP, PORT);
            console.log('action: new mt4 token generated');
            if (!response.message) {
              await updateServerTokenById(userConfig.id, response);
              BrokerToken = response;
              break;
            } else {
              connectionAttempts++;
            }
          }
        } else {
          BrokerToken = userConfig.serverToken;
        }

        portfolioSize = await mt4Server.accountSummary(BrokerToken);
      }
     
      const currentDate = new Date();
      const startDay = moment(currentDate).subtract(1, 'days').startOf('day').toDate();
      const endOfDay = moment(currentDate).subtract(1, 'days').endOf('day').toDate();

     

      // Get the latest trading order for yesterday
      const yesterdayTradingOrder = await TradingOrder.findOne({
        userId: userId,
        createdAt: { $gte: startDay, $lte: endOfDay },
      })
        .sort({ createdAt: -1 })
        .exec();

        const yesterdayTradingOrderArray = await TradingOrder.find({
          userId: userId,
          createdAt: { $gte: startDay, $lte: endOfDay },
        })
          .exec();  

      

      const todayPerformance = yesterdayTradingOrder ? portfolioSize.balance - yesterdayTradingOrder.balance : 0;

      // Calculate the percentage
      const initialBalance = portfolioSize.balance;
      const todayPerformancePercentage = (todayPerformance / initialBalance) * 100;
      // Determine if it's a profit or loss
      const isProfit = todayPerformancePercentage >= 0;
      const sign = isProfit ? '+' : '-';

      // Convert the percentage to a string with 2 decimal places and a profit/loss sign (e.g., '+25.23%' or '-10.12%')
      const todayPerformancePercentageString = sign + Math.abs(todayPerformancePercentage).toFixed(2);

      return { todayPerformance: todayPerformance.toFixed(2), todayPerformancePercentage: yesterdayTradingOrder ? todayPerformancePercentageString : 0, tradeData: yesterdayTradingOrderArray };
    }
  } catch (error) {
    console.error('Error in calculateTodayPerformance:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error calculating today performance');
  }
};

const calculateLifetimePerformance = async (userId) => {
  try {
    const userConfig = await getUserExchangeConfigByUserId(userId);

    if (userConfig) {
      // Get the user's trading orders
      const tradingOrders = await TradingOrder.find({ userId });

      if (tradingOrders.length > 0) {
        // Calculate the initial and current balance
        const initialBalance = userConfig.walletAmount;
        const lastTradingOrder = tradingOrders[tradingOrders.length - 1];
        const currentBalance = lastTradingOrder.balance;

        // Calculate  percentage
        const lifetimePerformancePercentage = ((currentBalance - initialBalance) / initialBalance) * 100;

        // Determine profit or loss
        const isProfit = lifetimePerformancePercentage >= 0;
        const sign = isProfit ? '+' : '-';

        // Convert the percentage (e.g., '+25.23%' or '-10.12%')
        const lifetimePerformancePercentageString = sign + Math.abs(lifetimePerformancePercentage).toFixed(2);

        return {
          lifetimePerformancePercentage: lifetimePerformancePercentageString,
          lifetimePerformance: (currentBalance - initialBalance).toFixed(2),
          tradeData: tradingOrders
        };
      }else{
        return {
          lifetimePerformancePercentage: 0,
          lifetimePerformance: 0,
          tradeData: tradingOrders
        };
      }
    }
  } catch (error) {
    console.error('Error in calculateLifetimePerformance:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error calculating lifetime performance');
  }
};

const calculateLastMonthPerformance = async (userId) => {
  try {
    const userConfig = await getUserExchangeConfigByUserId(userId);

    if (userConfig) {
      // Get the user's trading orders for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const tradingOrders = await TradingOrder.find({
        userId,
        createdAt: { $gte: thirtyDaysAgo },
      });

      if (tradingOrders.length > 0) {
        // Calculate the initial and current balance
        const initialBalance = tradingOrders[0].balance;
        const lastTradingOrder = tradingOrders[tradingOrders.length - 1];
        const currentBalance = lastTradingOrder.currentBalance;

        // Calculate last 30 days
        const lastMonthPercentage = ((currentBalance - initialBalance) / initialBalance) * 100;

        // Determine profit or loss
        const isProfit = lastMonthPercentage >= 0;
        const sign = isProfit ? '+' : '-';

        // Convert the percentage (e.g., '+25.23%' or '-10.12%')
        const lastMonthPercentageString = sign + Math.abs(lastMonthPercentage).toFixed(2);

        return {
          lastMonthPercentage: lastMonthPercentageString >= 0?lastMonthPercentageString:0 ,
          lastMonth: (currentBalance - initialBalance)>= 0 ?currentBalance - initialBalance :0,
          tradeData: tradingOrders
        };
      } else {
        return {
          lastMonthPercentage: 0,
          lastMonth: 0,
          tradeData: tradingOrders
        };
      }
    }
  } catch (error) {
    console.error('Error in calculateLifetimePerformance:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error calculating lifetime performance');
  }
};

// const updatestopLossTradeOrder = async (ticketId, lots) => {
//   const updateOrder = await TradingOrder.findOneAndUpdate(
//     { ticketId: ticketId },
//     {
//       $set: {
//         lots: lots,
//       },
//     }
//   );
//   if (!updateOrder) {
//     throw new ApiError(httpStatus.NOT_FOUND);
//   }

//   return updateOrder;
// };

// const updateCancelTradeOrder = async (ticketId, lots) => {
//   const updateOrder = await TradingOrder.findOneAndUpdate(
//     { ticketId: ticketId },
//     {
//       $set: {
//         lots: lots,
//       },
//     }
//   );
//   if (!updateOrder) {
//     throw new ApiError(httpStatus.NOT_FOUND);
//   }

//   return updateOrder;
// };

const updateCloseBinanceTradingOrder = async (masterTicketId,userId, order,orderType) => {
  const orderData = await TradingOrder.findOne({ masterTicketId: masterTicketId, userId:userId });
  const updateOrder = await TradingOrder.findOneAndUpdate(
    { masterTicketId: masterTicketId, userId:userId },
    {
      $set: {
        closeTime: await convertISOString(order.time),
        closePrice: order.avgPrice,
        profit: ((order.avgPrice - orderData.openPrice) * orderData.lots).toFixed(3),
        orderType: orderType,
      },
    }
  );
  if (!updateOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  const updatedTradingOrder = await TradingOrder.findOne({ masterTicketId: masterTicketId, userId:userId });

  return updatedTradingOrder;
};
module.exports = {
  createTradingOrder,
  getTradeOrderCount,
  getTradingOderByID,
  updateTradeOrderLots,
  updateTradingOrder,
  deleteTradingOrderById,
  getAllTradingOrderWithPagination,
  checkMasterTradingId,
  updateTradeOrderByMasterTicket,
  updateTradeOrderType,
  getGraphTradeOrder,
  getPortfolioValue,
  calculateTodayPerformance,
  calculateLifetimePerformance,
  calculateProfitLoss,
  calculateLastMonthPerformance,
  createBinanceTradingOrder,
  convertISOString,
  updateCloseBinanceTradingOrder,
  checkAllMasterTradingId,
};
