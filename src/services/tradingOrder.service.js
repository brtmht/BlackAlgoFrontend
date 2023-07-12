const httpStatus = require('http-status');
const { TradingOrder } = require('../models');
const ApiError = require('../utils/ApiError');
const { symbol } = require('joi');
const mt4Server = require('../middlewares/mt4Server');
const { getUserExchangeConfigByUserId } = require('./userExchangeConfig.service');

/**
 * Create a TradingOrder
 * @param {Object} tradingOrderBody
 * @returns {Promise<TradingOrder>}
 */
const createTradingOrder = async (tradingOrderBody, userId, masterData, orderType) => {
  let tradingData;
  if (tradingOrderBody) {
    tradingData = {
      userId,
      masterTicketId: masterData.Ticket,
      ticketId: tradingOrderBody.ticket,
      copiedTo: "MT4",
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
  const tradingOrder = await TradingOrder.find({ _id });
  if (!tradingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  return tradingOrder;
};

/**
 * Query for strategies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTradingOrderHistory = async (filter, options) => {
  const tradingOrder = await TradingOrder.paginate(filter, options);
  return tradingOrder;
};

/**
 * Check if MasterTicket id is exist
 * @param {string} masterTicketId - The trading Master Ticket id
 */
const checkMasterTradingId = async (masterTicketId,user_id) => {
  const data = await TradingOrder.findOne({ masterTicketId, userId:user_id});
  return data;
};

/**
 * Get Trading orders count by userId
 * @param {string} masterTicketId - The trading Master Ticket id
 */
const getTradeOrderCount = async (user_id) => {
  const count = await TradingOrder.countDocuments({userId:user_id});
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
    throw new ApiError(httpStatus.NOT_FOUND,"Data not found");
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
const updateTradeOrderByMasterTicket = async(ticketId,data,orderType) =>{

  const updateOrder = await TradingOrder.findOneAndUpdate(
    { ticketId: data.ticket },
    {
      $set: {
        masterTicketId: ticketId,
        ticketId: data.ticket,
        copiedTo: "MT4",
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
        orderType:orderType,
      },
    }
  );
  if (!updateOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  const updatedTradingOrder = await TradingOrder.findOne({ ticketId: data.ticket });

  return updatedTradingOrder;

}

/**
 * Update trade order lots data on the bases of ticket id
 * @param {string} masterTicketId - The trading masterTicketId
 */
const updateTradeOrderLots = async(ticketId,lots) =>{

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

}

/**
 * Update trade order comment data on the bases of ticket id
 * @param {string} masterTicketId - The trading masterTicketId
 */
const updateTradeOrderType = async(ticketId, user_id, orderType) =>{

  const updateOrder = await TradingOrder.findOneAndUpdate(
    { masterTicketId: ticketId, userId: user_id },
    {
      $set: {
        orderType: orderType,
      },
    }
  );
  if (!updateOrder) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  return updateOrder;

}

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
        createdAt: { $gte: TwentyHourAgo },
      }).exec();
      break;
    case '1hr':
      const oneHourAgo = new Date(orderData.timestamp - 1 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        createdAt: { $gt: oneHourAgo },
      }).exec();
      break;
    case '7day':
      const sevenDaysAgo = new Date(orderData.timestamp - 7 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        createdAt: { $gte: sevenDaysAgo },
      }).exec();
      break;
    case '30day':
      const thirtyDaysAgo = new Date(orderData.timestamp - 30 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        createdAt: { $gte: thirtyDaysAgo },
      }).exec();
      break;
    case '90day':
      const ninetyDaysAgo = new Date(orderData.timestamp - 90 * 24 * 60 * 60 * 1000);
      ordersList = await TradingOrder.find({
        userId: id,
        createdAt: { $gte: ninetyDaysAgo },
      }).exec();
      break;
      case '1year':
        const oneYearAgo = new Date(orderData.timestamp - 365 * 24 * 60 * 60 * 1000);
        ordersList = await TradingOrder.find({
          userId: id,
          createdAt: { $gte: oneYearAgo },
        }).exec();
        break;
      case 'all':
        ordersList = await TradingOrder.find({
          userId: id,
        }).exec();
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
  
    if (userConfig) {
      const portfolioSize = await mt4Server.accountSummary(userConfig.config.serverToken);
      return portfolioSize;
    }
  } catch (error) {
    console.error('Error in getPortfolioValue:', error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Error in getPortfolioValue');
  }
};

const calculateProfitLoss = async (userId) => {
  try {
    const userConfig = await getUserExchangeConfigByUserId(userId);
  
    if (userConfig) {
      const portfolioSize = await mt4Server.accountSummary(userConfig.config.serverToken);
      return portfolioSize;
    }
  } catch (error) {
    console.error('Error in getPortfolioValue:', error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Error in getPortfolioValue');
  }
};


const getLast24HrTardingOrders = async (id,timestamp, step) => {
  if(step){

  }
  const orders24Hr = TradingOrder.find({
    userId: id,
    createdAt: { $gt: new Date(timestamp - 24 * 60 * 60 * 1000) },
  }).exec();

  return orders24Hr;
};
const getLast1HrTardingOrders = async (id) => {
  const orders24Hr = TradingOrder.find({
    userId: id,
    createdAt: { $gt: new Date(timestamp - 1 * 60 * 60 * 1000) },
  }).exec();
  return orders24Hr;
};
const getLast1WeekTardingOrders = async (id) => {
  const orders24Hr = TradingOrder.find({
    userId: id,
    createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }).exec();
  return orders24Hr;
};
module.exports = {
  createTradingOrder,
  getTradeOrderCount,
  getTradingOderByID,
  updateTradeOrderLots,
  queryTradingOrderHistory,
  updateTradingOrder,
  deleteTradingOrderById,
  getLast24HrTardingOrders,
  getLast1HrTardingOrders,
  getLast1WeekTardingOrders,
  getAllTradingOrderWithPagination,
  checkMasterTradingId,
  updateTradeOrderByMasterTicket,
  updateTradeOrderType,
  getGraphTradeOrder,
  getPortfolioValue,
};
