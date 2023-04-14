const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Post notifications
 * @param {Object} notificationData
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationData) => {
  const notification = await Notification.create({
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type,
  });
  return notification;
};
/**
 * Get notifications by userId
 * @param {ObjectId} userId
 * @returns {Promise<Notification>}
 */
const getAllNotificationByUserID = async (userId) => {
  const notificatios = await Notification.find({ userId });
  return notificatios;
};

/**
 * Get notification by id
 * @param {ObjectId} id
 * @returns {Promise<Notification>}
 */
const getNotificationById = async (id) => {
  return Notification.findById(id);
};

/**
 * Update notification by id
 * @param {ObjectId} notificationId
 * @param {Object} notificationData
 * @returns {Promise<Notification>}
 */
const updateNotificationStatus = async (notificationId, notificationData) => {
  const notification = await getNotificationById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  const notificationBeforeUpdate = await Notification.findByIdAndUpdate(notificationId, {
    isRead: notificationData.status,
  });
  return notificationBeforeUpdate;
};

/**
 * Delete notification by id
 * @param {ObjectId} notificationId
 * @returns {Promise<Notification>}
 */
const deleteNotification = async (notificationId) => {
  const notification = await getNotificationById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  const notificationDeleted = await Notification.findByIdAndUpdate(notificationId, { isDeleted: true });
  return notificationDeleted;
};

module.exports = {
  createNotification,
  updateNotificationStatus,
  deleteNotification,
  getAllNotificationByUserID,
};
