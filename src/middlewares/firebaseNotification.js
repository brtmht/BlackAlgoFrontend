/* eslint-disable import/no-extraneous-dependencies */
const admin = require('firebase-admin');

const firebaseAccount = require('../../firebaseAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount),
});

const sendNotification = (notificationData) => {
  const message = {
    notification: {
      title: notificationData.title,
      body: notificationData.body,
    },
    token: notificationData.token,
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
};
module.exports = sendNotification;
