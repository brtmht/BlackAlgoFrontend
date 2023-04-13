/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mtAccountService, mtBrokerService } = require('../services');
// Mt account crud apis
const createMtAccount = catchAsync(async (req, res) => {
  const mtAccount = await mtAccountService.createMtAccountNew(req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(mtAccount);
});

const getMtAccount = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mtAccountService.queryMTAccount(filter, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});

const updateMtAccount = catchAsync(async (req, res) => {
  console.log(req.params);
  console.log(req.query);

  const mtAccount = await mtAccountService.updateMtAccountById(req.query.mtAccountId, req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(mtAccount);
});

const deleteMtAccount = catchAsync(async (req, res) => {
  await mtAccountService.deleteMtAccountById(req.query.mtAccountId);
  res.status(httpStatus.NO_CONTENT).send();
});

// mtBroker crud Apis
const createMtBroker = catchAsync(async (req, res) => {
  const mtAccount = await mtBrokerService.createMtBrokerNew(req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(mtAccount);
});

const getMtBroker = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mtBrokerService.queryMTBroker(filter, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});

const updateMtBroker = catchAsync(async (req, res) => {
  console.log(req.query.mtBrokerId);
  const mtBrokert = await mtBrokerService.updateMtBrokerById(req.query.mtBrokerId, req.body);
  if (!mtBrokert) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(mtBrokert);
});

const deleteMtBroker = catchAsync(async (req, res) => {
  await mtBrokerService.deleteMtBrokerById(req.query.mtBrokerId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMtAccount,
  getMtAccount,
  updateMtAccount,
  deleteMtAccount,
  createMtBroker,
  getMtBroker,
  updateMtBroker,
  deleteMtBroker,
};
