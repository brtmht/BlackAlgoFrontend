const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { adminService, authService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');

const adminlogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user.role === 'user') {
    throw new ApiError(httpStatus.FORBIDDEN, 'user cannot loggin as admin');
  }
  if (user.role === 'admin' || user.role === 'manager') {
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
  } else {
    res.status(httpStatus.FORBIDDEN).send();
  }
});
const updateUser = catchAsync(async (req, res) => {
  const user = await adminService.updateUser(req.body, req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_MODIFIED);
  }
  res.send(user);
});
const send2faBackupKey = catchAsync(async (req, res) => {
  const result = await adminService.send2faKey(req.params.userId);
  if (!result) {
    throw new ApiError(httpStatus.NO_CONTENT);
  }
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  adminlogin,
  updateUser,
  send2faBackupKey,
};
