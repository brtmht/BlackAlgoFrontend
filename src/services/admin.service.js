const httpStatus = require('http-status');
const { User, Strategy, UserStrategy, UserExchangeConfig } = require('../models');
const constants = require('../config/constants');
const { emailService } = require('./index');
const ApiError = require('../utils/ApiError');

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};
/**
 * Create a exchange
 * @param {Object} userBody
 * @returns {Promise<Exchange>}
 */
const updateUser = async (userBody, userId) => {
  const user = await getUserById(userId);
  if(user.email !== userBody?.email){
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
    }
  }
  const strategy = await Strategy.findOne({ name: userBody.strategy });
  if(!strategy){
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          name: userBody?.name || user.name,
          email: userBody?.email || user.email,
        },
      }
    );
    return { user, message:`User doesn't have any selected strategy`, status:202}
  }
  try {
    await UserStrategy.findOneAndUpdate({ userId }, { strategyId: strategy._id });
    await UserExchangeConfig.findOneAndUpdate({ userId }, { strategyId: strategy._id });
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          name: userBody?.name || user.name,
          email: userBody?.email || user.email,
        },
      }
    );
    return { user, message:`User and strategy  updated succecfully`, status:200}

  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
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
