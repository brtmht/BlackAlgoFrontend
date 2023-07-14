const admin = require('firebase-admin');
const { Notification } = require('../models');
const firebaseAccount = require('../../firebaseAccount.json');
const { emitData } = require('../socket');

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount),
});
const sendNotification = async (notificationData, user) => {
 const notificationCreated =  await Notification.create({
    userId: user._id,
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type,
  });
  emitData('Notification', { success: true, code: 201, message: 'Notification Successfully', data: notificationCreated });
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