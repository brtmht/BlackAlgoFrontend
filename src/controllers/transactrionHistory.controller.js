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

module.exports = {
  getStripeTransactionHistory,
  getCryptoTransactionHistory,
};
