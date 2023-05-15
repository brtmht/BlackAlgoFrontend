const httpStatus = require('http-status');
const { TradingOrder } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TradingOrder
 * @param {Object} tradingOrderBody
 * @returns {Promise<TradingOrder>}
 */
const createTradingOrder = async (tradingOrderBody, userId) => {
  let tradingData;
  if (tradingOrderBody) {
    tradingData = {
      userId,
      copiedTo: tradingOrderBody.copiedTo,
      symbol: tradingOrderBody.symbol,
      digits: tradingOrderBody.digit,
      operation: tradingOrderBody.type,
      volume: tradingOrderBody.volume,
      openTime: tradingOrderBody.openTime,
      state: tradingOrderBody.state,
      openPrice: tradingOrderBody.openPrice,
      stoplimit: tradingOrderBody.stoplimit,
      takeprice: tradingOrderBody.takeprice,
      closeTime: tradingOrderBody.closeTime,
      expiration: tradingOrderBody.expiration,
      reason: tradingOrderBody.reason,
      commission: tradingOrderBody.commission,
      storage: tradingOrderBody.storage,
      closePrice: tradingOrderBody.closePrice,
      profit: tradingOrderBody.profit,
      taxes: tradingOrderBody.taxes,
      magic: tradingOrderBody.magic,
      comment: tradingOrderBody.comment,
      activation: tradingOrderBody.activation,
      marginRate: tradingOrderBody.marginRate,
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
 * Get tradingOrder by userId
 * @param {ObjectId} userId
 * @returns {Promise<TradingOrder>}
 */
const getLast24HrTardingOrders = async (id) => {
  const orders24Hr = TradingOrder.find({
    userId: id,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).exec();
  return orders24Hr;
};
const getLast1HrTardingOrders = async (id) => {
  const orders24Hr = TradingOrder.find({
    userId: id,
    createdAt: { $gt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
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
  getTradingOderByID,
  queryTradingOrderHistory,
  updateTradingOrder,
  deleteTradingOrderById,
  getLast24HrTardingOrders,
  getLast1HrTardingOrders,
  getLast1WeekTardingOrders,
};
