const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userStrategyService } = require('../services');

const createUserStrategy = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const userStrategy = await userStrategyService.createUserStrategy(req.body, userId);
  res.status(httpStatus.CREATED).send(userStrategy);
});

const getUserStrategies = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userStrategyService.queryUserStrategies(filter, options);
  res.send(result);
});

const getUserStrategy = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const userStrategy = await userStrategyService.getUserStrategyByUserId(userId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  res.send(userStrategy);
});

const getUserStrategyById = catchAsync(async (req, res) => {
  const userStrategy = await userStrategyService.getUserStrategyById(req.params.userStrategyId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  res.send(userStrategy);
});

const updateUserStrategy = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const userStrategy = await userStrategyService.updateUserStrategyById(userId, req.body);
  res.send(userStrategy);
});

const deleteUserStrategy = catchAsync(async (req, res) => {
  await userStrategyService.deleteUserStrategyById(req.params.userStrategyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUserStrategy,
  getUserStrategies,
  getUserStrategy,
  updateUserStrategy,
  deleteUserStrategy,
  getUserStrategyById,
};
