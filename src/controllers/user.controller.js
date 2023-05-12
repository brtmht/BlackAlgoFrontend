const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const sendNotification = require('../middlewares/firebaseNotification');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});
const getUser = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const user = await userService.getUserById(userId);
  if (user.notificationToken !== null) {
    const notification = {
      title: 'Successful',
      message: 'You getting user succesfully',
    };
    sendNotification(notification, user.notificationToken);
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
// 2FA API
const get2FactorAuthentication = catchAsync(async (req, res) => {
  const result = await userService.generate2faSecret(req.user);
  res.send(result);
});
const get2FactorVerified = catchAsync(async (req, res) => {
  const result = await userService.verify2faSecret(req);
  res.send(result);
});

const turnOff2fa = catchAsync(async (req, res) => {
  const result = await userService.turnOff2fa(req.user);
  res.send(result);
});

const turnOn2fa = catchAsync(async (req, res) => {
  const result = await userService.turnOn2fa(req);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'token not found');
  }
  res.send(result);
});

const getBackUpSecretKey = catchAsync(async (req, res) => {
  const result = await userService.getBackUpSecretKey(req);
  res.send(result);
});
const regenerate2faSecret = catchAsync(async (req, res) => {
  const result = await userService.regenerate2faSecret(req);
  res.send(result);
});
const activate2faSecret = catchAsync(async (req, res) => {
  const result = await userService.activateNew2faSecret(req);
  res.send(result);
});
const updateUser = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await userService.updateUserDataById(userId, req);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await userService.updateUserPasword(userId, req.body);
  res.sendStatus(httpStatus.NO_CONTENT);
});

// admin Get all user
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const blockUser = catchAsync(async (req, res) => {
  await userService.blockUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const unblockUser = catchAsync(async (req, res) => {
  await userService.unBlockUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const clearUserToken = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await userService.clearUserTokenById(userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getUserWalletAmount = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const amount = await userService.getUserWalletAmount(userId);
  res.send(amount);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  clearUserToken,
  changePassword,
  get2FactorAuthentication,
  get2FactorVerified,
  turnOff2fa,
  turnOn2fa,
  regenerate2faSecret,
  activate2faSecret,
  getBackUpSecretKey,
  blockUser,
  unblockUser,
  getUserWalletAmount,
};
