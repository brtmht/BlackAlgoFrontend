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

const getTradingOrder = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tradingOrderService.queryTradingOrderHistory(filter, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});

const tradingOrderWithPagination = catchAsync(async (req, res) => {
  const user = req.user._id;
  const options = pick(req.query, ['limit', 'page']);
  const tradingOrders = await tradingOrderService.getAllTradingOrderWithPagination(user, options);
  if (!tradingOrders) {
    throw new ApiError(httpStatus.NOT_FOUND,"Data not found");
  }
  res.send({"success":true, code:201 , "message":"Transaction history data listed", "data":tradingOrders});
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
  const Orders = await tradingOrderService.getGraphTradeOrder(req.body,req.user._id);
  if (!Orders) {
    throw new ApiError(httpStatus.NOT_FOUND,"Data not found");
  }
  res.send({"success":true, code:201 , "message":"Transaction history data listed", "data":Orders});
});


const performanceCalculation = catchAsync(async (req, res) => {
  try {
    const portfolioValue = await tradingOrderService.getPortfolioValue(req.user._id);
    const profitLoss = await tradingOrderService.calculateProfitLoss(req.user._id);
    const lastMonthPerformance = await tradingOrderService.calculateLastMonthPerformance(req.user._id);
    const lifeTimePerformance = await tradingOrderService.calculateLifetimePerformance(req.user._id);
    const todayPerformance = await tradingOrderService.calculateTodayPerformance(req.user._id);

    res.send({
      "success": true,
      "code": 201,
      "message": "Data listed",
      "data": {
        portfolioValue,
        profitLoss,
        lastMonthPerformance,
        lifeTimePerformance,
        todayPerformance
      }
    });
  } catch (error) {
    console.error('Error in performanceCalculation:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      "success": false,
      "code": 500,
      "message": "Error fetching performance data",
      "data": null
    });
  }
});




const getLast24HrTardingOrders = catchAsync(async (req, res) => {
  const last24HrOrders = await tradingOrderService.getLast24HrTardingOrders(req.user._id);
  if (!last24HrOrders) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(last24HrOrders);
});
const getLast1HrTardingOrders = catchAsync(async (req, res) => {
  const last24HrOrders = await tradingOrderService.getLast1HrTardingOrders(req.user._id);
  if (!last24HrOrders) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(last24HrOrders);
});
const getLast1WeekTardingOrders = catchAsync(async (req, res) => {
  const last24HrOrders = await tradingOrderService.getLast1WeekTardingOrders(req.user._id);
  if (!last24HrOrders) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(last24HrOrders);
});
module.exports = {
  createTradingOrder,
  getTradingOrder,
  getTradingOrderById,
  getLast24HrTardingOrders,
  getLast1HrTardingOrders,
  getLast1WeekTardingOrders,
  updateTradingOrder,
  deleteTradingOrder,
  tradingOrderWithPagination,
  graphTradeOrders,
  performanceCalculation,
};
