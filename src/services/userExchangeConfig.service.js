const httpStatus = require('http-status');
const { UserExchangeConfig } = require('../models');
const ApiError = require('../utils/ApiError');
const {encryptData, decryptData} = require('../middlewares/common');
const { getExchangeById } = require('./exchange.service');
const { exchangeService, userStrategyService } = require('.');

/**
 * Create a UserExchangeConfig
 * @param {Object}reqData
 * @returns {Promise<Exchange>}
 */
const createUserExchangeConfig = async (reqData, userId, serverToken) => {

  return UserExchangeConfig.create({
    userId: userId._id,
    exchangeId: reqData.exchangeId,
    strategyId: reqData.strategyId,
    config: {
      login: reqData.config.login,
      password: await encryptData(reqData.config.password),
      server: reqData.config.server,
    },
    serverToken: serverToken,
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
  const userExchange = await userStrategyService.getStrategyByUserId(id);
  const data = await UserExchangeConfig.findOne({userId:id, connected:true});
  console.log(data,"----------------------data");
  if(data){

    const { _id, userId, strategyId, exchangeId, config, serverToken, connected, tokenExpiry, status, createdAt, updatedAt, __v } = data._doc;
    const exchangeData = await exchangeService.getExchangeById(exchangeId);
    console.log(exchangeData);
    config.password = decryptData(data.config.password);
    const updatedResponse = {
      _id,
      userId,
      strategyId,
      exchangeId,
      config,
      serverToken,
      connected,
      tokenExpiry,
      status,
      createdAt,
      updatedAt,
      exchangeName: exchangeData?exchangeData.name:'',
      __v,
    };
    return updatedResponse;
  }else{
    const updatedResponse = {
      exchangeName: userExchange?userExchange.name:'',
      connected:false,
    };
  }

 
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


/**
 * update mt4 connection
 * @returns {Promise<UserExchangeConfig>}
 */
const getAllConnectionData = async (options) => {
  const skipCount = (options.page - 1) * options.limit;
  const exchange = await exchangeService.getExchangeByName(options.brokerName);
  const connectedUserList = await UserExchangeConfig.find( {connected: true, exchangeId:exchange.id}).populate('userId').sort({ createdAt: -1 }).skip(skipCount).limit(options.limit);
 const connectedUserCount = await UserExchangeConfig.countDocuments({connected: true});
 const disconnectedUserCount = await UserExchangeConfig.countDocuments({connected: false});
 if (connectedUserList.length === 0) {
  throw new ApiError(httpStatus.NOT_FOUND,"Data not found");
}
return {
  userList:connectedUserList,
  page: options.page,
  pageLimit: options.limit,
  connectedUserCount:connectedUserCount,
  disconnectedUserCount: disconnectedUserCount,
  totalCount: connectedUserCount,
};

 return ({connectedUserList:connectedUserList,connectedUserCount:connectedUserCount,disconnectedUserCount:disconnectedUserCount});

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
  getAllConnectionData,
};
