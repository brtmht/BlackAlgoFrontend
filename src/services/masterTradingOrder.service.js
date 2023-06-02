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
 * @param {string} type - The name of the trading order action type
 * @returns {Promise<boolean>}
 */
const checkTradingId = async (ticket,type) => {
  const data = await MasterTradingOrder.findOne({ ticket, type: { $ne: type } });
  return !!data;
};

module.exports = {
  createMasterTradingOrder,
  checkTradingId,
};
