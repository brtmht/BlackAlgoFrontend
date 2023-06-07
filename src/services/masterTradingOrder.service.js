const httpStatus = require('http-status');
const { MasterTradingOrder } = require('../models');  
const ApiError = require('../utils/ApiError');

/**
 * Create a TradingOrder
 * @param {Object} masterTradingOrderBody
 * @returns {Promise<MasterTradingOrder>}
 */
const createMasterTradingOrder = async (masterTradingOrderBody, orderType) => {
  let tradingData;
  if (masterTradingOrderBody) {
    tradingData = {
      ticket: masterTradingOrderBody.Ticket,
      copiedTo: "MT4",
      openTime: masterTradingOrderBody.OpenTime,
      closeTime: masterTradingOrderBody.CloseTime,
      expiration: masterTradingOrderBody.Expiration,
      operation: masterTradingOrderBody.Type,
      lots: masterTradingOrderBody.Lots,
      symbol: masterTradingOrderBody.Symbol,
      openPrice: masterTradingOrderBody.OpenPrice,
      stopLoss: masterTradingOrderBody.StopLoss,
      takeProfit: masterTradingOrderBody.TakeProfit,
      closePrice: masterTradingOrderBody.ClosePrice,
      magic: masterTradingOrderBody.MagicNumber,
      swap: masterTradingOrderBody.Swap,
      commission: masterTradingOrderBody.Commission,
      comment: masterTradingOrderBody.Comment,
      profit: masterTradingOrderBody.Profit,
      openRate: masterTradingOrderBody.RateOpen,
      closeRate: masterTradingOrderBody.RateClose,
      digits: masterTradingOrderBody.Ex.digits,
      volume: masterTradingOrderBody.Ex.volume,
      state: masterTradingOrderBody.Ex.state,
      reason: masterTradingOrderBody.reason,
      storage: masterTradingOrderBody.Ex.storage,
      taxes: masterTradingOrderBody.Ex.taxes,
      activation: masterTradingOrderBody.Ex.activation,
      marginRate: masterTradingOrderBody.RateMargin,
      orderType:orderType,
    };
  }
  return MasterTradingOrder.create(tradingData);
};

/**
 * Check if ticket id is exist
 * @param {string} ticket - The trading Ticket
 */
const checkTradingId = async (ticket) => {
  const data = await MasterTradingOrder.findOne({ ticket});
  return data;
};


/**
 * Update trade oder data on the bases of ticket id
 * @param {string} ticket - The trading Ticket
 */
const updateTradeOrder = async(ticketId,lots) =>{

  const updateOrder = await MasterTradingOrder.findOneAndUpdate(
    { ticket: ticketId },
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

module.exports = {
  createMasterTradingOrder,
  checkTradingId,
  updateTradeOrder,
};
