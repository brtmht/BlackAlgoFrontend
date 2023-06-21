const httpStatus = require('http-status');
const { UserExchangeConfig } = require('../models');
const ApiError = require('../utils/ApiError');
const {encryptData, decryptData} = require('../middlewares/common');
const { getExchangeById } = require('./exchange.service');
const { exchangeService } = require('.');

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
      password: await encryptData(reqData.config.password),
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

const getUserExchangeConfigByUserId = async (id) => {
  return UserExchangeConfig.findOne({userId:id});
};

const getConnectedUserExchangeConfig = async (id) => {
  const data = await UserExchangeConfig.findOne({userId:id, connected:true});
  const exchangeData = await exchangeService.getExchangeById(data.exchangeId);
  data.config.password = decryptData(data.config.password);
  data.exchangeName = exchangeData.name;
  return data;
};

const updateUserExchangeConfigById = async (user_id, updateBody, serverToken) => {
  const exchangeConfig = await UserExchangeConfig.findOne({userId:user_id});
  if (!exchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserExchangeConfig Id not found');
  }
  const updatedExchangeConfig = await UserExchangeConfig.findOneAndUpdate({userId:user_id}, {
    userId:user_id,
    exchangeId: updateBody.exchangeId,
    config: {
      login: updateBody.config.login,
      password: await encryptData(updateBody.config.password),
      server: updateBody.config.server,
    },
    serverToken:serverToken,
    connected: true,
  });

  // if(updateUserExchangeConfig){
  //   const data = await UserExchangeConfig.findById(id);
  // }

  return updatedExchangeConfig;
};

/**
 * Update UserExchangeConfig  server token by id
 * @param {ObjectId} UserExchangeConfigId
 * @param {Object} updateData
 * @returns {Promise<UserExchangeConfig>}
 */
const updateServerTokenById = async (UserExchangeConfigId, serverToken) => {
  const UserExchangeData = await getUserExchangeConfigById(UserExchangeConfigId);
  if (!UserExchangeData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserExchangeConfig Id not found');
  }
  const updatedData = await UserExchangeConfig.findOneAndUpdate(
    { _id: UserExchangeConfigId },
    {
      $set: {
        serverToken: serverToken,
      },
    }
  );

  return updatedData;
};

/**
 * Get connected user data
 * @returns {Promise<UserExchangeConfig>}
 */
const getConnectedUser = async () => {
  return UserExchangeConfig.find({connected:true});
};

/**
 * update mt4 connection
 * @returns {Promise<UserExchangeConfig>}
 */
const updateConnectionData = async (user_id) => {
  return UserExchangeConfig.findOneAndUpdate(
    { userId: user_id },
    {
      $set: {
        connected: true,
      },
    }
  );
};

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfigById,
  updateUserExchangeConfigById,
  updateServerTokenById,
  getConnectedUser,
  getUserExchangeConfigByUserId,
  updateConnectionData,
  getConnectedUserExchangeConfig,
};
