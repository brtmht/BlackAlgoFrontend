const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, userStrategyService } = require('../services');
const constants = require('../config/constants');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  const contentData = {
    token: verifyEmailToken,
    url: process.env.BASE_URL,
  };
  await userStrategyService.createUserStrategy(req.body, user.id);
  await emailService.sendEmail(user, contentData, constants.VERIFY_EMAIL_OPTIONS);
  res.send({
    success: true,
    code: 201,
    message: 'A verification link has been sent to your email address',
    data: { user, tokens },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user.isDeleted === true || user.isBlocked === true) {
    res.send({ success: false, error_code: 401, message: 'This user is deleted or blocked' });
  }

  if (user.role === 'admin' || user.role === 'manager') {
    res.send({ success: false, error_code: 401, message: 'You are not authorised' });
  }
  if (user.isEmailVerified === false) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    const contentData = {
      token: verifyEmailToken,
      url: process.env.BASE_URL,
    };
    await emailService.sendEmail(user, contentData, constants.VERIFY_EMAIL_OPTIONS);
    res.send({ success: false, error_code: 403, message: 'Verification link sent to your email . please verify it.' });
  } else {
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ success: true, code: 201, message: 'Logged in Successfully', data: { user, tokens } });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ success: true, code: 201, message: 'Token generated Successfully', data: { ...tokens } });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const contentData = {
    token: resetPasswordToken,
    url: process.env.APP_URL,
  };
  await emailService.sendEmail(req.body, contentData, constants.RESETPASSWORD_EMAIL_OPTIONS);

  res.send({ success: true, code: 200, message: 'Reset password link sent to your email account' });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.send({ success: true, code: 200, message: 'Your password reset successfully' });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  const userData = await authService.verifyEmail(req.query.token);
  if (userData === null) {
    res.redirect(`${process.env.APP_URL}/?confirm=expired`);
  }
  if (userData != null || !userData) {
    if (userData.isEmailVerified === true) {
      if (userData.notificationToken !== null) {
        const notification = {
          title: `Email Verify successfully`,
          message: `Your ${userData.email}  verify successfully`,
        };
        // sendNotification(notification, userData);
      }
      res.redirect(`${process.env.APP_URL}/?confirm=thankyou`);
    } else {
      res.redirect(`${process.env.APP_URL}/?confirm=error`);
    }
  } else {
    res.redirect(`${process.env.APP_URL}/?confirm=error`);
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
