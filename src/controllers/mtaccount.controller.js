/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { exchangeService } = require('../services');

const createMtAccount = catchAsync(async (req, res) => {
  const mtAccount = await exchangeService.createMtAccountNew(req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(mtAccount);
});

const getMtAccount = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await exchangeService.queryMTAccount(filter, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});

const updateMtAccount = catchAsync(async (req, res) => {
  const mtAccount = await exchangeService.updateMtAccountById(req, req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(mtAccount);
});

const deleteMtAccount = catchAsync(async (req, res) => {
  await exchangeService.deleteMtAccountId(req);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMtAccount,
  getMtAccount,
  updateMtAccount,
  deleteMtAccount,
};
