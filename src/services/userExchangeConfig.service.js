const httpStatus = require('http-status');
const { UserExchangeConfig } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a UserExchangeConfig
 * @param {Object}reqData
 * @returns {Promise<Exchange>}
 */
const createUserExchangeConfig = async (reqData, userId) => {

  return UserExchangeConfig.create({
    userId: userId._id,
    exchangeId: reqData.exchangeId,
    config: {
      login: reqData.config.login,
      password: reqData.config.password,
      server: reqData.config.server,
    },
    connected: false,
  });
};

/**
 * Get UserExchangeConfigBody by id
 * @param {ObjectId} id
 * @returns {Promise<UserExchangeConfig>}
 */
const getUserExchangeConfigById = async (id) => {
  return UserExchangeConfig.findById(id);
};

const updateUserExchangeConfigById = async (UserExchangeConfigId, updateBody) => {
  const UserExchangeConfig = await getUserExchangeConfigById(UserExchangeConfigId);
  if (!UserExchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserExchangeConfig Id not found');
  }
  const updateUserExchangeConfig = await updateUserExchangeConfig.findByIdAndUpdate(UserExchangeConfigId, {
    ...updateBody,
  });

  return updateUserExchangeConfig;
};

/**
 * Update UserExchangeConfig  server token by id
 * @param {ObjectId} UserExchangeConfigId
 * @param {Object} updateData
 * @returns {Promise<UserExchangeConfig>}
 */
const updateServerTokenById = async (UserExchangeConfigId, updateData) => {
  const UserExchangeConfig = await getUserExchangeConfigById(UserExchangeConfigId);
  if (!UserExchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserExchangeConfig Id not found');
  }
  const updatedData = await User.findOneAndUpdate(
    { _id: UserExchangeConfigId },
    {
      $set: {
        serverToken: updateData.serverToken,
      },
    }
  );

  return updatedData;
};

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfigById,
  updateUserExchangeConfigById,
  updateServerTokenById,
};
