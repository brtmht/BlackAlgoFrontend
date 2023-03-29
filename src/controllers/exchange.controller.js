const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { exchangeService } = require('../services');

const createExchange = catchAsync(async (req, res) => {
  const exchange = await exchangeService.createExchange(req.body);
  res.status(httpStatus.CREATED).send(exchange);
});

const getExchanges = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await exchangeService.queryExchanges(filter, options);
  res.send(result);
});

const getExchange = catchAsync(async (req, res) => {
  const exchange = await exchangeService.getExchangeById(req.params.exchangeId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
  }
  res.send(exchange);
});

const updateExchange = catchAsync(async (req, res) => {
  const exchange = await exchangeService.updateExchangeById(req.params.exchangeId, req.body);
  res.send(exchange);
});

const deleteExchange = catchAsync(async (req, res) => {
  await exchangeService.deleteExchangeById(req.params.exchangeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createExchange,
  getExchanges,
  getExchange,
  updateExchange,
  deleteExchange,
};
