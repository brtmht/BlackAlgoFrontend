const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tradingOrderService, userExchangeConfig } = require('../services');
// Mt account crud apis
const createTradingOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const tradingOrder = await tradingOrderService.createTradingOrder(req.body, userId);
  if (!tradingOrder) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(tradingOrder);
});

const tradingOrderWithPagination = catchAsync(async (req, res) => {
  const user = req.user._id;
  const options = pick(req.query, ['limit', 'page']);
  const tradingOrders = await tradingOrderService.getAllTradingOrderWithPagination(user, options);
  if (!tradingOrders) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  res.send({ success: true, code: 201, message: 'Transaction history data listed', data: tradingOrders });
  // res.send(tradingOrders);
});

const getTradingOrderById = catchAsync(async (req, res) => {
  const tradingOrder = await tradingOrderService.getTradingOderByID(req.params.orderId);
  res.send(tradingOrder);
});

const updateTradingOrder = catchAsync(async (req, res) => {
  const tradingOrder = await tradingOrderService.updateTradingOrder(req.body, req.params.orderId);
  if (!tradingOrder) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(tradingOrder);
});

const deleteTradingOrder = catchAsync(async (req, res) => {
  await tradingOrderService.deleteTradingOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send();
});

const graphTradeOrders = catchAsync(async (req, res) => {
  const transactions = await tradingOrderService.getGraphTradeOrder(req.body, req.user._id);
  let cumulativeProfit = 0;
  const cumulativeResults = [];

  transactions.forEach((transaction) => {
    const profit = parseFloat(transaction.Profit);
    cumulativeProfit += profit;
    cumulativeResults.push({ profit:cumulativeProfit.toFixed(2), CloseTime: transaction.CloseTime });
  });
  if (!Orders) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  res.send({ success: true, code: 201, message: 'Transaction history data listed', data: cumulativeResults });
});

const performanceCalculation = catchAsync(async (req, res) => {
  try {
    const portfolioValue = await tradingOrderService.getPortfolioValue(req.user._id);
    const profitLoss = await tradingOrderService.calculateProfitLoss(req.user._id);
    const lastMonthPerformance = await tradingOrderService.calculateLastMonthPerformance(req.user._id);
    const lifeTimePerformance = await tradingOrderService.calculateLifetimePerformance(req.user._id);
    const todayPerformance = await tradingOrderService.calculateTodayPerformance(req.user._id);

    res.send({
      success: true,
      code: 201,
      message: 'Data listed',
      data: {
        portfolio:portfolioValue,
        profitLoss: profitLoss,
        lastMonthPerformance:lastMonthPerformance,
        lifeTimePerformance:lifeTimePerformance,
        todayPerformance:todayPerformance,
      },
    });
  } catch (error) {
    console.error('Error in performanceCalculation:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: 500,
      message: 'Error fetching performance data',
      data: null,
    });
  }
});

module.exports = {
  createTradingOrder,
  getTradingOrderById,
  updateTradingOrder,
  deleteTradingOrder,
  tradingOrderWithPagination,
  graphTradeOrders,
  performanceCalculation,
};
