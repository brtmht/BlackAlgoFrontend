const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { strategyService } = require('../services');

const createStrategy = catchAsync(async (req, res) => {
  const strategy = await strategyService.createStrategy(req.body);
  res.status(httpStatus.CREATED).send(strategy);
});

const getStrategies = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await strategyService.queryStrategies(filter, options);
  res.send({"success":true, code:201 , "message":"Strategies get Successfully", "data":result});
});

const getStrategy = catchAsync(async (req, res) => {
  const strategy = await strategyService.getStrategyById(req.params.strategyId);
  if (!strategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Strategy not found');
  }
  res.send({"success":true, code:201 , "message":"Strategy get Successfully", "data":strategy});
});

const updateStrategy = catchAsync(async (req, res) => {
  const strategy = await strategyService.updateStrategyById(req.params.strategyId, req.body);
  res.send(strategy);
});

const deleteStrategy = catchAsync(async (req, res) => {
  await strategyService.deleteStrategyById(req.params.strategyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createStrategy,
  getStrategies,
  getStrategy,
  updateStrategy,
  deleteStrategy,
};
