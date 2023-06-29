const sendNotification = require('./firebaseNotification');
const userService = require('../services/user.service');
var CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY; 

const generateNotification = async (notificationData, userId) => {
   const user = await userService.getUserById(userId);
    if (user && user.notificationToken !== null) {
        const notification = {
          title: notificationData.title,
          message: notificationData.message,
        };
       sendNotification(notification, user);
      }
  };
  

const encryptData = async(data) =>{
  const encrypted = data && CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return encrypted;
}

const decryptData = (data) => {
 const decrypted =data && CryptoJS.AES.decrypt((data), SECRET_KEY).toString(CryptoJS.enc.Utf8);
 return decrypted;
}

const checkDecimalVal = (num) => {
  const epsilon = 0.0000001;
  const fraction = (num + epsilon) % 1;
  return fraction.toString().length - 2;
}

module.exports = {
  generateNotification,
  encryptData,
  decryptData,
  checkDecimalVal,
};