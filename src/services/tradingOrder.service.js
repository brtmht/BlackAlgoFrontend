const httpStatus = require('http-status');
const { TradingOrder } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TradingOrder
 * @param {Object} tradingOrderBody
 * @returns {Promise<TradingOrder>}
 */
const createTradingOrder = async (tradingOrderBody, userId, masterData) => {
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
const checkMasterTradingId = async (masterTicketId) => {
  const data = await TradingOrder.find({ masterTicketId});
  return data;
};

/**
 * Get Trading orders with pagination by userId
 * @param {ObjectId} userId
 * @returns {Promise<TradingOrder>}
 */
const getAllTradingOrderWithPagination = async (userId, options) => {
  const skipCount = (options.page - 1) * options.limit;
  const trdingOrderCount = await TradingOrder.find({ userId });
  const tradingOrders = await TradingOrder.find({ userId }).sort({ createdAt: -1 }).skip(skipCount).limit(options.limit);
  if (tradingOrders.length === 0) {
    throw new ApiError(httpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
  }
  return {
    tradingOrders,
    page: options.page,
    pageLimit: options.limit,
    hasNextData: trdingOrderCount.length > options.page * options.limit,
  };
};


/**
 * Update trade oder data on the bases of ticket id
 * @param {string} masterTicketId - The trading masterTicketId
 */
const updateTradeOrderByMasterTicket = async(ticketId,data) =>{

  const updateOrder = await TradingOrder.findOneAndUpdate(
    { masterTicketId: ticketId },
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
        digits: data.ex.digits,
        volume: data.ex.volume,
        state: data.ex.state,
        reason: data.reason,
        storage: data.ex.storage,
        taxes: data.ex.taxes,
        activation: data.ex.activation,
        marginRate: data.rateMargin,
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
  getAllTradingOrderWithPagination,
  checkMasterTradingId,
  updateTradeOrderByMasterTicket,
};
