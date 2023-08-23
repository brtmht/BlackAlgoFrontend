const httpStatus = require('http-status');
const { User } = require('../models');
const constants = require('../config/constants');
const { emailService } = require('./index');
const ApiError = require('../utils/ApiError');

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
const searchUserByText = async (reqData, filter, options) => {
  // Construct regex pattern using the reqData variable
  const regexPattern = new RegExp(reqData, 'i'); // 'i' flag for case-insensitive search
  const users = await User.paginate(
    {
      $and: [
        {
          $or: [{ name: { $regex: regexPattern } }, { email: { $regex: regexPattern } }],
        },
        { isDeleted: false },
        { isBlocked: false },
        { role: filter.role },
      ],
    },
    options
  );
  if (users.length === 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No matching users found');
  }
  return users;
};

module.exports = {
  updateUser,
  send2faKey,
  searchUserByText,
};
