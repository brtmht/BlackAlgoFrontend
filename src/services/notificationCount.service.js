const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');

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
module.exports = {
  unreadNotificationCount,
};
