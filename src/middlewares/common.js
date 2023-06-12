const sendNotification = require('./firebaseNotification');
const userService = require('../services/user.service');

const generateNotification = async (notificationData, userId) => {
   const user = await userService.getUserById(userId);
    if (user.notificationToken !== null) {
        const notification = {
          title: notificationData.title,
          message: notificationData.message,
        };
       sendNotification(notification, user);
      }
  };
  module.exports = generateNotification;