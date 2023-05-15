const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transactionHistoryService } = require('../services');
const ApiError = require('../utils/ApiError');

const getStripeTransactionHistory = catchAsync(async (req, res) => {
  const history = await transactionHistoryService.getStripeTransactionHistory();
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(history);
});

const getCryptoTransactionHistory = catchAsync(async (req, res) => {
  const history = await transactionHistoryService.getCryptoTransactionHistory();
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(history);
});

const getLast24HrTransactionHistory = catchAsync(async (req, res) => {
  const last24HrTransactionHistory = await transactionHistoryService.getLast24HrTransactionHistory(req.user._id);
  if (!last24HrTransactionHistory) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(last24HrTransactionHistory);
});
const getLast1MonthTransactionHistory = catchAsync(async (req, res) => {
  const last1MonthTransactionHistory = await transactionHistoryService.getLast30DaysTransactionHistory(req.user._id);
  if (!last1MonthTransactionHistory) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(last1MonthTransactionHistory);
});
const getLast1WeekTransactionHistory = catchAsync(async (req, res) => {
  const last1WeekTransactionHistory = await transactionHistoryService.getLast1WeekTransactionHistory(req.user._id);
  if (!last1WeekTransactionHistory) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(last1WeekTransactionHistory);
});
module.exports = {
  getStripeTransactionHistory,
  getCryptoTransactionHistory,
  getLast1WeekTransactionHistory,
  getLast1MonthTransactionHistory,
  getLast24HrTransactionHistory,
};
