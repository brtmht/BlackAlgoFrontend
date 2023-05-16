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
const getMtAccountById = catchAsync(async (req, res) => {
  const mtAccount = await mtAccountService.getMtAccountById(req.params.mtAccountId);
  res.send(mtAccount);
});

const updateMtAccount = catchAsync(async (req, res) => {
  const mtAccount = await mtAccountService.updateMtAccountById(req.params.mtAccountId, req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(mtAccount);
});

const deleteMtAccount = catchAsync(async (req, res) => {
  await mtAccountService.deleteMtAccountById(req.params.mtAccountId);
  res.status(httpStatus.NO_CONTENT).send();
});

// mtBroker crud Apis
const createMtBroker = catchAsync(async (req, res) => {
  const mtBroker = await mtBrokerService.createMtBrokerNew(req.body);
  if (!mtBroker) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(mtBroker);
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
const getMtBrokerById = catchAsync(async (req, res) => {
  const mtBroker = await mtBrokerService.getMtBrokerById(req.params.mtBrokerId);
  res.send(mtBroker);
});
const updateMtBroker = catchAsync(async (req, res) => {
  const mtBrokert = await mtBrokerService.updateMtBrokerById(req.params.mtBrokerId, req.body);
  if (!mtBrokert) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.status(httpStatus.CREATED).send(mtBrokert);
});

const deleteMtBroker = catchAsync(async (req, res) => {
  await mtBrokerService.deleteMtBrokerById(req.params.mtBrokerId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMtAccount,
  getMtAccountById,
  getMtAccount,
  updateMtAccount,
  deleteMtAccount,
  createMtBroker,
  getMtBroker,
  getMtBrokerById,
  updateMtBroker,
  deleteMtBroker,
};
