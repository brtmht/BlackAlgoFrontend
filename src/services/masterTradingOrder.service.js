const httpStatus = require('http-status');
const { MasterTradingOrder } = require('../models');  
const ApiError = require('../utils/ApiError');

/**
 * Create a TradingOrder
 * @param {Object} masterTradingOrderBody
 * @returns {Promise<MasterTradingOrder>}
 */
const createMasterTradingOrder = async (masterTradingOrderBody) => {
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
const updateTradeOrder = async(data) =>{

  const updateOrder = await MasterTradingOrder.findOneAndUpdate(
    { ticket: data.Ticket },
    {
      $set: {
        ticket: data.Ticket,
      copiedTo: "MT4",
      openTime: data.OpenTime,
      closeTime: data.CloseTime,
      expiration: data.Expiration,
      operation: data.Type,
      lots: data.Lots,
      symbol: data.Symbol,
      openPrice: data.OpenPrice,
      stopLoss: data.StopLoss,
      takeProfit: data.TakeProfit,
      closePrice: data.ClosePrice,
      magic: data.MagicNumber,
      swap: data.Swap,
      commission: data.Commission,
      comment: data.Comment,
      profit: data.Profit,
      openRate: data.RateOpen,
      closeRate: data.RateClose,
      digits: data.Ex.digits,
      volume: data.Ex.volume,
      state: data.Ex.state,
      reason: data.reason,
      storage: data.Ex.storage,
      taxes: data.Ex.taxes,
      activation: data.Ex.activation,
      marginRate: data.RateMargin,
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
