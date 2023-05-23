const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userExchangeConfig } = require('../services');

const createUserExchangeConfig = catchAsync(async (req, res) => {
  const exchangeConfig = await userExchangeConfig.createUserExchangeConfig(req.body,req.user);
  res.status(httpStatus.CREATED).send(exchangeConfig);
});

const getUserExchangeConfig = catchAsync(async (req, res) => {
  const userExchangeConfig = await userExchangeConfig.getUserExchangeConfigById(req.user._id);
  if (!userExchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User ExchangeConfig not found');
  }
  res.send(userExchangeConfig);
});

const updateUserExchangeConfig = catchAsync(async (req, res) => {
  const userExchangeConfig = await userExchangeConfig.updateUserExchangeConfigById(req.params.exchangeConfigId, req.body);
  res.send(userExchangeConfig);
});


module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfig,
  updateUserExchangeConfig,
};
