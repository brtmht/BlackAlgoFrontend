const sendNotification = require('./firebaseNotification');
const userService = require('../services/user.service');
var CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
const BINANCE_SECRET_KEY =  process.env.BINANCE_SECRET_KEY
const ALGORITHM = 'aes-256-cbc'; 
const crypto = require('crypto');
const IV = '79551cda8de30ae9943d182a3f290cf4'

// Function to encrypt a string
const encryptDataForBinance = async(inputString)=> {
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(BINANCE_SECRET_KEY, 'hex'), Buffer.from(IV, 'hex'));

  let encryptedData = cipher.update(inputString, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  return encryptedData;
}

// Function to decrypt a string
const decryptDataForBinance = async(encryptedData)=> {
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(BINANCE_SECRET_KEY, 'hex'), Buffer.from(IV, 'hex'));

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}

// Function to compare a string with its encrypted value
const compareEncryptedVal = async(inputString, encryptedData)=> {
  const decryptedString = decryptDataForBinance(encryptedData);
  return inputString === decryptedString;
}


// function hashValue(value) {
//   const hash = crypto.createHash('sha256');
//   hash.update(value);
//   return hash.digest('hex');
// }

// function encryptDataForBinance(data) {
//   const cipher = crypto.createCipher(ALGORITHM, SECRET_KEY);
//   let encrypted = cipher.update(data, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   const hashData = hashValue(encrypted);
//   return hashData;
// }

// function decryptDataForBinance(encryptedData) {
//   const decipher = crypto.createDecipher(ALGORITHM, SECRET_KEY);
//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

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
  decryptDataForBinance,
  encryptDataForBinance,
  compareEncryptedVal
};