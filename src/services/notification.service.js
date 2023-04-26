/* eslint-disable import/no-extraneous-dependencies */
const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const sendNotification = require('../middlewares/firebaseNotification');
/**
 * Post notifications
 * @param {Object} notificationData
 * @param {id} id
 * @returns {Promise<Notification>}
 */
const getToken = async (notificationData, id) => {
  await sendNotification(notificationData);
  const msgResponse = await Notification.create({
    userId: id,
    title: notificationData.title,
    message: notificationData.message,
  });
  return msgResponse;
};

/**
 * Get notifications by userId
 * @param {ObjectId} userId
 * @returns {Promise<Notification>}
 */
const getAllNotificationByUserID = async (userId) => {
  const notificatinos = await Notification.find({ userId });
  return notificatinos;
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
    ...notificationData,
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
  getToken,
  getNotificationById,
  updateNotificationStatus,
  deleteNotification,
  getAllNotificationByUserID,
};
