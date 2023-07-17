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
  const { user } = req;
  if (user.notificationToken !== null) {
    const notification = {
      title: `User Found`,
      message: `You got to ${user.name} logged in as ${user.email}`,
    };
    // sendNotification(notification, user);
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ success: true, code: 201, message: 'User data fetch Successfully', data: user });
});
// 2FA API
const get2FactorAuthentication = catchAsync(async (req, res) => {
  const result = await userService.generate2faSecret(req.user);
  res.send({ success: true, code: 201, message: 'Generated 2fa code  Successfully', data: result });
});
const get2FactorVerified = catchAsync(async (req, res) => {
  const result = await userService.verify2faSecret(req);
  res.send({ success: true, code: 201, message: '2fa verify Successfully', data: result });
});

const turnOff2fa = catchAsync(async (req, res) => {
  const result = await userService.turnOff2fa(req.user);
  res.send({ success: true, code: 201, message: 'Turn off 2fa Successfully', data: result });
});

const disabled2faBySecret = catchAsync(async (req, res) => {
  const result = await userService.getUserDataBy2faSecret(req.body.backupKey);
  res.send({ success: true, code: 200, message: 'Two factor authentication disabled successfully' });
});

const turnOn2fa = catchAsync(async (req, res) => {
  const result = await userService.turnOn2fa(req);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'token not found');
  }
  res.send({ success: true, code: 201, message: 'Turn on 2fa Successfully', data: result });
});

const getBackUpSecretKey = catchAsync(async (req, res) => {
  const result = await userService.getBackUpSecretKey(req);
  res.send({ success: true, code: 201, message: '2fa returned Successfully', '2FA': result });
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
  const updatedData = await userService.getUserById(req.user._id);
  res.send({ success: true, code: 201, message: 'User data updated successfully', data: updatedData });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await userService.updateUserPasword(userId, req.body);
  res.send({ success: true, code: 200, message: 'User password updated successfully' });
});

// admin Get all user
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isDeleted', 'isBlocked', 'role', 'monthlyUsers']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});
const getUserById = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.userId);
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
  const user = await userService.clearUserTokenById(userId);
  if (!user) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'User not found');
  }
  res.send({ success: true, code: 200, message: 'Notification token cleared' });
});
const getUserWalletAmount = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const amount = await userService.getUserWalletAmount(userId);
  res.send(amount);
});

const checkEmail = catchAsync(async (req, res) => {
  const data = await userService.getUserByEmail(req.body.email);
  if (data) {
    res.send({ success: false, code: 409, message: 'Email already exist' });
  }
  res.send({ success: true, code: 200, message: 'Email not exist' });
});
const sharingImageUpload = catchAsync(async (req, res) => {
  const filePath = await userService.uploadShareImage(req);
  if (!filePath) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send({ success: true, code: 200, message: 'image uploaded successfully', data: { imagePath: `${filePath}` } });
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserById,
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
  disabled2faBySecret,
  checkEmail,
  sharingImageUpload,
};
