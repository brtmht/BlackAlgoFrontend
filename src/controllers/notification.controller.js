const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const addNotificationToken = catchAsync(async (req, res) => {
  const { user } = req;
  const notificationToken = await notificationService.saveToken(req.body, user);
  if (!notificationToken) {
    throw new ApiError(httpStatus.SEE_OTHER);
  }
  res.send({ success: true, code: 200, message: 'Notification token saved successfully' });
});
// Create Notification for testing
const createNotification = catchAsync(async (req, res) => {
  const { user } = req;
  const notification = await notificationService.createNotification(req.body, user._id);
  if (!notification) {
    throw new ApiError(httpStatus.SEE_OTHER);
  }
  res.status(httpStatus.OK).send(notification);
});

const getUserNotifications = catchAsync(async (req, res) => {
  const user = req.user._id;
  const options = pick(req.query, ['limit', 'page']);
  const notifications = await notificationService.getAllNotificationByUserID(user, options);
  if (!notifications) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Found');
  }
  res.send({ success: true, code: 201, message: 'Notification listed Successfully', data: notifications });
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

const updateReadAllNotification = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const notification = await notificationService.ReadAllNotification(userId);
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

// Unread Notification count
const getUnreadNotification = catchAsync(async (req, res) => {
  const user = req.user._id;
  const notifcations = await notificationService.unreadNotificationCount(user);
  const count = notifcations.length;
  if (!notifcations) {
    throw new ApiError(httpStatus.SEE_OTHER);
  }
  res.send({ success: true, code: 201, message: 'Notification listed Successfully', data: { notifcations, count } });
});

// admin Api
const getAllNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getAllNotification();
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  res.send({ success: true, code: 201, message: 'Notification listed Successfully', data: notification });
});
const getAllNotificationInGroup = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const user = req.user._id;
  const notification = await notificationService.getAllNotificationInGroup(user, options);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  res.send({ success: true, code: 201, message: 'Notification listed Successfully', data: notification });
});
module.exports = {
  addNotificationToken,
  createNotification,
  getUserNotifications,
  getNotificationWithId,
  updateNotification,
  deleteNotification,
  getUnreadNotification,
  getAllNotification,
  getAllNotificationInGroup,
  updateReadAllNotification,
};
