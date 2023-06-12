const admin = require('firebase-admin');
const { Notification } = require('../models');
const firebaseAccount = require('../../firebaseAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount),
});
const sendNotification = async (notificationData, userId) => {
  await Notification.create({
    userId: userId,
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type,
  });
  user.notificationToken.forEach(async function (token) {
    const message = {
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
      token,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  });
};
module.exports = sendNotification;
