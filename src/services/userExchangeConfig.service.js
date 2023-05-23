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
      login: reqData.login,
      password: reqData.password,
      server: reqData.server,
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

/**
 * Update UserExchangeConfig by id
 * @param {ObjectId} UserExchangeConfigId
 * @param {Object} updateBody
 * @returns {Promise<UserExchangeConfig>}
 */
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

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfigById,
  updateUserExchangeConfigById,
};
