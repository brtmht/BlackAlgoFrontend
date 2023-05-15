/* eslint-disable import/no-extraneous-dependencies */
const httpStatus = require('http-status');
const { Notification, User } = require('../models');
const ApiError = require('../utils/ApiError');
const sendNotification = require('../middlewares/firebaseNotification');

/**
 * Post notifications
 * @param {Object} notificationData
 * @param {id} id
 * @returns {Promise<Notification>}
 */
const saveToken = async (notificationData, user) => {
  const found = user.notificationToken.find((notificationToken) => notificationToken === notificationData.token);
  if (!found) {
    const msgResponse = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $push: {
          notificationToken: notificationData.token,
        },
      }
    );
    return msgResponse;
  }
};

/**
 * Post notifications
 * @param {Object} notificationData
 * @param {id} id
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationData, user) => {
  // Calling firebase notification
  await sendNotification(notificationData, user);
  const msgResponse = await Notification.create({
    userId: user._id,
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type,
  });
  return msgResponse;
};

/**
 * Get notifications by userId
 * @param {ObjectId} userId
 * @returns {Promise<Notification>}
 */
const getAllNotificationByUserID = async (userId) => {
  const notificatinos = await Notification.find({ userId }).sort({ createdAt: -1 });
  return notificatinos;
};

/**
 * Get notification by id
 * @param {ObjectId} id
 * @returns {Promise<Notification>}
 */
const getNotificationById = async (id) => {
  return Notification.findById(id).sort({ createdAt: -1 });
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

/**
 * unread notification
 * @param {object}id
 * @return {promise<Notification/>}
 */
const unreadNotificationCount = async (id) => {
  try {
    const count = await Notification.find({
      $and: [{ userId: id }, { isRead: false }],
    });
    return count.length;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
};

// Admin Api
/**
 * Get All Notifications
 * @returns {Promise<Notification>}
 */
const getAllNotification = async () => {
  const notificatinos = await Notification.find().sort({ createdAt: -1 });
  return notificatinos;
};
module.exports = {
  createNotification,
  getNotificationById,
  updateNotificationStatus,
  deleteNotification,
  getAllNotificationByUserID,
  unreadNotificationCount,
  getAllNotification,
  saveToken,
};
