const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { supportService } = require('../services');

const createSupports = catchAsync(async (req, res) => {
  const user = req.user._id;
  const Supports = await supportService.createSupport(user, req.body);
  res.status(httpStatus.CREATED).send(Supports);
});

// get recent messages
const getSupports = catchAsync(async (req, res) => {
  const user = req.user._id;
  // const filter = pick(req.query, ['name']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await supportService.querySupports(user);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});

// get user's messages by userId
const getUsersMessage = catchAsync(async (req, res) => {
  const user = req.user._id;
  const messages = await supportService.getUsersMessageById(user);
  res.send(messages);
});
// update support messages by message id
const updateSupport = catchAsync(async (req, res) => {
  const supports = await supportService.updateSupportById(req.params.supportId, req.body);
  res.send(supports);
});

const deleteSupport = catchAsync(async (req, res) => {
  await supportService.deleteSupportById(req.params.supportId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSupports,
  getSupports,
  getUsersMessage,
  updateSupport,
  deleteSupport,
};
