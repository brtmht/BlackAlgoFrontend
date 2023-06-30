const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { exchangeService } = require('../services');

const createExchange = catchAsync(async (req, res) => {
  const exchange = await exchangeService.createExchange(req);
  res.status(httpStatus.CREATED).send(exchange);
});

const getExchanges = catchAsync(async (req, res) => {
  const data = await exchangeService.getExchanges();
  res.send({ success: true, code: 201, message: 'Exchanges get Successfully', data: { result: data } });
});

const getExchange = catchAsync(async (req, res) => {
  const exchange = await exchangeService.getExchangeById(req.params.exchangeId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
  }
  res.send({ success: true, code: 201, message: 'Exchange get Successfully', data: exchange });
});

const updateExchange = catchAsync(async (req, res) => {
  const exchange = await exchangeService.updateExchangeById(req.params.exchangeId, req);
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
