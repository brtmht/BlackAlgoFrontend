const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userStrategyService, userExchangeConfig } = require('../services');


const createUserStrategy = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const userStrategy = await userStrategyService.createUserStrategy(req.body, userId);
  res.send({ success: true, code: 201, message: 'User strategy created Successfully', data: userStrategy });
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
  res.send({ success: true, code: 201, message: 'User strategy data get Successfully', data: userStrategy });
});

const onBoardUserStrategy = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const userStrategy = await userStrategyService.updateOnBoardStrategy(userId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  res.send({ success: true, code: 200, message: 'User strategyonboard status updated Successfully' });
});

const getUserStrategyById = catchAsync(async (req, res) => {
  const userStrategy = await userStrategyService.getUserStrategyById(req.params.userStrategyId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  res.send(userStrategy);
});

const updateUserStrategy = catchAsync(async (req, res) => {
  const userStrategy = await userStrategyService.updateUserStrategyById(req.user._id, req.body);
  await userExchangeConfig.updateStrategyId(req.user._id, req.body.strategyId);
  res.send({ success: true, code: 201, message: 'User strategy updated Successfully', data: userStrategy });
});

const deleteUserStrategy = catchAsync(async (req, res) => {
  await userStrategyService.deleteUserStrategyById(req.params.userStrategyId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllUserStrategy = catchAsync(async (req, res) => {
  const allStrategies = await userStrategyService.getUserData();
  res.status(httpStatus.OK).send(allStrategies);
});
module.exports = {
  createUserStrategy,
  getUserStrategies,
  getUserStrategy,
  updateUserStrategy,
  deleteUserStrategy,
  getUserStrategyById,
  onBoardUserStrategy,
  getAllUserStrategy,
};
