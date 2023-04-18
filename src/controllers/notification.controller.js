const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const createNotificationToken = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const notification = await notificationService.getToken(req.body, userId);
  if (!notification) {
    throw new ApiError(httpStatus.SEE_OTHER);
  }
  res.status(httpStatus.OK).send(notification);
});

const getUserNotifications = catchAsync(async (req, res) => {
  const user = req.user._id;
  const notifications = await notificationService.getAllNotificationByUserID(user);
  if (!notifications) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(notifications);
});
const getNotificationWithId = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(notification);
});
const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotificationStatus(req.params.notificationId, req.body);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_Found);
  }
  res.send(notification);
});
const deleteNotification = catchAsync(async (req, res) => {
  const deleted = await notificationService.deleteNotification(req.params.notificationId);
  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.sendStatus(httpStatus.NO_CONTENT);
});
module.exports = {
  createNotificationToken,
  getUserNotifications,
  getNotificationWithId,
  updateNotification,
  deleteNotification,
};
