const { User } = require('../models');
const constants = require('../config/constants');
const { emailService } = require('./index');

/**
 * Create a exchange
 * @param {Object} userBody
 * @returns {Promise<Exchange>}
 */
const updateUser = async (userBody, id) => {
  return User.findByIdAndUpdate(id, {
    ...userBody,
  });
};
const send2faKey = async (id) => {
  const user = await User.findById(id);
  if (user.google_2fa_status) {
    const contentData = {
      token: user.google_2fa_secret,
      url: process.env.BASE_URL,
    };
    await emailService.sendEmail(user, contentData, constants.SEND_BACKUP_2FA);
    return user;
  }
  return false;
};
module.exports = {
  updateUser,
  send2faKey,
};
