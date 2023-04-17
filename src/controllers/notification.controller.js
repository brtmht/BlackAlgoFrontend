const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

// const app = initializeApp();

const createNotificationToken = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotificationToken(req);
  if (!notification) {
    throw new ApiError(httpStatus.SEE_OTHER);
  }
  res.status(httpStatus.OK).send(notification);
});

module.exports = {
  createNotificationToken,
};
