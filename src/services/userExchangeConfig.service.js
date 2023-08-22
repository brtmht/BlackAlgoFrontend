const httpStatus = require('http-status');
const axios = require('axios');
const crypto = require('crypto');
const { UserExchangeConfig } = require('../models');
const ApiError = require('../utils/ApiError');
const { encryptData, decryptData, encryptDataForBinance } = require('../middlewares/common');
const { userStrategyService, exchangeService } = require('.');
const mt4Server = require('../middlewares/mt4Server');
const { GetBinanceBalance } = require('./binance.service');
/**
 * Create a UserExchangeConfig
 * @param {Object}reqData
 * @returns {Promise<Exchange>}
 */
const createUserExchangeConfig = async (reqData, userId, serverToken) => {
  const wallet_amount = await mt4Server.accountSummary(serverToken);
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
    subscriptionStatus: false,
    walletAmount: wallet_amount.balance,
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

const getUserExchangeConfigByLogin = async (reqData) => {
  try {
    const { login, server } = reqData.config;
    const userExchangeConfig = await UserExchangeConfig.findOne({
      'config.login': login.toString(),
      'config.server': server,
       connected: true,
    });
    return userExchangeConfig;
  } catch (error) {
    console.error('Error retrieving user exchange config:', error);
    // Handle the error appropriately
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
  }
};

const getUserExchangeConfigByUserId = async (id) => {
  return UserExchangeConfig.findOne({ userId: id });
};

const getConnectedUserExchangeConfig = async (id) => {
  const userExchange = await userStrategyService.getStrategyByUserId(id);
  const data = await UserExchangeConfig.findOne({ userId: id, connected: true });
  if (data) {
    const {
      _id,
      userId,
      strategyId,
      exchangeId,
      config,
      serverToken,
      connected,
      subscriptionStatus,
      subscriptionStart,
      subscriptionExpiry,
      subscriptionCancelReason,
      tokenExpiry,
      status,
      createdAt,
      updatedAt,
      __v,
    } = data._doc;
    const exchangeData = await exchangeService.getExchangeById(exchangeId);
    // config.password = decryptData(data.config.password);
    return (updatedResponse = {
      _id,
      userId,
      strategyId,
      exchangeId,
      config,
      serverToken,
      connected,
      subscriptionStatus,
      subscriptionStart,
      subscriptionExpiry,
      subscriptionCancelReason,
      tokenExpiry,
      status,
      createdAt,
      updatedAt,
      exchangeName: exchangeData ? exchangeData.name : '',
      __v,
    });
  } else {
    const exchangeData = await exchangeService.getExchangeById(userExchange.exchangeId);
    return (updatedResponse = {
      exchangeName: exchangeData ? exchangeData.name : '',
      connected: false,
    });
  }
};

const updateUserExchangeConfigById = async (user_id, updateBody, serverToken) => {
  const wallet_amount = await mt4Server.accountSummary(serverToken);
  const exchangeConfig = await UserExchangeConfig.findOne({ userId: user_id });
  if (!exchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserExchangeConfig Id not found');
  }
  const updatedExchangeConfig = await UserExchangeConfig.findOneAndUpdate(
    { userId: user_id },
    {
      userId: user_id,
      exchangeId: updateBody.exchangeId,
      config: {
        login: updateBody.config.login,
        password: await encryptData(updateBody.config.password),
        server: updateBody.config.server,
      },
      serverToken: serverToken,
      connected: true,
      walletAmount: wallet_amount.balance,
    }
  );

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
  return UserExchangeConfig.find({ connected: true, subscriptionStatus: true });
};

const getActiveUser = async (user_id) => {
  return UserExchangeConfig.findOne({ userId: user_id });
};

const getConnectedAccountUser = async () => {
  return UserExchangeConfig.find({ connected: true, config: { $exists: true, $ne: {} } });
};

const updateStripeSubscription = async (user, current_period_end, current_period_start) => {
  const exchangeConfig = await UserExchangeConfig.findOne({ userId: user.userId });
  if (exchangeConfig) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: user.userId },
      {
        $set: {
          connected: true,
          subscriptionStatus: true,
          subscriptionStart: current_period_start,
          subscriptionExpiry: current_period_end,
        },
      }
    );
  }

  return UserExchangeConfig.create({
    userId: user.userId,
    exchangeId: user.exchangeId,
    strategyId: user.strategyId,
    subscriptionStatus: true,
    connected: true,
    subscriptionStart: current_period_start,
    subscriptionExpiry: current_period_end,
  });
};

const updateBinanceSubscription = async (userId) => {
  const user = await userStrategyService.getUserStrategyByUser(userId);
  if (user) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: user.userId },
      { $set: { connected: true, subscriptionStatus: false } }
    );
  }
};
const updateBinanceSubscriptionData = async (userId, current_period_start) => {
  const user = await userStrategyService.getUserStrategyByUser(userId);
  if (user) {
    const exchangeConfig = await UserExchangeConfig.findOne({ userId: user.userId });
    if (exchangeConfig) {
      return UserExchangeConfig.findOneAndUpdate(
        { userId: user.userId },
        {
          $set: {
            connected: true,
            subscriptionStatus: false,
            subscriptionStart: current_period_start,
          },
        }
      );
    }

    return UserExchangeConfig.create({
      userId: user.userId,
      exchangeId: user.exchangeId,
      strategyId: user.strategyId,
      subscriptionStatus: false,
      connected: true,
      subscriptionStart: current_period_start,
    });
  }
};
/**
 * update mt4 connection
 * @returns {Promise<UserExchangeConfig>}
 */
const getAllConnectionData = async (options) => {
  const skipCount = (options.page - 1) * options.limit;
  const exchange = await exchangeService.getExchangeByName(options.brokerName);
  const userList = await UserExchangeConfig.find({ exchangeId: exchange.id })
    .populate('userId')
    .populate('strategyId')
    .sort({ createdAt: -1 })
    .skip(skipCount)
    .limit(options.limit);
  const connectedUserCount = await UserExchangeConfig.countDocuments({ exchangeId: exchange.id, connected: true });
  const totalCount = await UserExchangeConfig.countDocuments({ exchangeId: exchange.id, connected: true });
  const disconnectedUserCount = await UserExchangeConfig.countDocuments({ connected: false, exchangeId: exchange.id });
  return {
    userList: userList,
    page: options.page,
    pageLimit: options.limit,
    connectedUserCount: connectedUserCount,
    disconnectedUserCount: disconnectedUserCount,
    totalCount: totalCount,
  };
};

const createAndConnectedConfig = async (reqData, userId, serverToken) => {
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
    connected: true,
  });
};

const disconnectConnectionSubscription = async (id, reason) => {
  const data = UserExchangeConfig.findOne({ userId: id });
  if (data) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          subscriptionStatus: false,
          subscriptionCancelReason: reason,
        },
      }
    );
  }
};

const disconnectSubscription = async (id, reason, contractTerminationTime) => {
  const data = UserExchangeConfig.findOne({ userId: id });
  if (data) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          subscriptionStatus: false,
          subscriptionCancelReason: reason,
          subscriptionExpiry: contractTerminationTime,
        },
      }
    );
  }
};

const disconnectConnection = async (id) => {
  const data = UserExchangeConfig.findOne({ userId: id });
  if (data) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          connected: false,
        },
      }
    );
  }
};

const activeConnection = async (id) => {
  const data = UserExchangeConfig.findOne({ userId: id });
  if (data) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          connected: true,
        },
      }
    );
  }
};

const activeSubscription = async (id) => {
  const data = UserExchangeConfig.findOne({ userId: id });
  if (data) {
    return UserExchangeConfig.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          subscriptionStatus: true,
        },
      }
    );
  }
};

const saveBinanceApiKeyAndSecret = async (binanaceCredentials, userId) => {
  const API_KEY = await encryptDataForBinance(binanaceCredentials.apiKey);
  const API_SECRET = await encryptDataForBinance(binanaceCredentials.apiSecret);
  let connectedStatus;

  try {
    const exchangeConfig = await UserExchangeConfig.findOne({
      'config.apiKey': API_KEY,
      'config.apiSecret': API_SECRET,
       connected: true,
    });
    
    if(!exchangeConfig){
      const timestamp = Date.now();
      const params = `timestamp=${timestamp}`;
      const signature = crypto.createHmac('sha256', binanaceCredentials.apiSecret).update(params).digest('hex');
      // const response = await axios.get('https://testnet.binancefuture.com/api/v3/account', {
      //   headers: {
      //     'X-MBX-APIKEY': binanaceCredentials.apiKey,
      //   },
      //   params: {
      //     timestamp,
      //     signature,
      //   },
      // });
       const userStrategy = await userStrategyService.getUserStrategyByUser(userId);
          if(userStrategy && userStrategy.paymentDetailId === undefined || userStrategy?.paymentDetailId === null){
              connectedStatus = false;
            }else{
              connectedStatus = true;
            }
      // if (response.status === 200) {
        // console.log(response.status,"----------------------------response.status");
        const userBalance = await GetBinanceBalance({apiSecret:API_SECRET, apiKey:API_KEY});
        const data = await UserExchangeConfig.findOne({ userId });
        if (data) {
          await UserExchangeConfig.findOneAndUpdate(
            { userId },
            {
              $set: {
                config: {
                  apiKey: API_KEY,
                  apiSecret: API_SECRET,
                },
                connected: connectedStatus,
                walletAmount: userBalance.balance,
              },  
            }
          );
          return { success: true, code: 200, message: 'Binance Connected Sucessfully.'};
        }
        return { success: false, code: 200, message: 'Data not found'};
      }
    else{
      return { success: false, code: 401, message: 'API key and secret already exist.'};
    }
  } catch (error) {
    console.error('Error testing API key and secret:', error);
    return { success: false, code: 401, message: 'API key and secret are not valid.'};
  }
};

const updateBinanceApiKeyAndSecret = async (binanaceCredentials, userId, exchangeId) => {
  const API_KEY = await encryptDataForBinance(binanaceCredentials.apiKey);
  const API_SECRET = await encryptDataForBinance(binanaceCredentials.apiSecret);
  let connectedStatus;

  try {
      const exchangeConfig = await UserExchangeConfig.findOne({
      'config.apiKey': API_KEY,
      'config.apiSecret': API_SECRET,
       connected: true,
    });

    if(!exchangeConfig){
      const timestamp = Date.now();
      const params = `timestamp=${timestamp}`;
      const signature = crypto.createHmac('sha256', API_SECRET).update(params).digest('hex');
      // const response = await axios.get('https://testnet.binancefuture.com/api/v3/account', {
      //   headers: {
      //     'X-MBX-APIKEY': API_KEY,
      //   },
      //   params: {
      //     timestamp,
      //     signature,
      //   },
      // });
      const userStrategy = await userStrategyService.getUserStrategyByUser(userId);
      if(userStrategy && userStrategy.paymentDetailId === undefined || userStrategy?.paymentDetailId === null){
          connectedStatus = false;
        }else{
          connectedStatus = true;
        }
      // if (response.status === 200) {
        const userBalance = await GetBinanceBalance({apiSecret:API_SECRET, apiKey:API_KEY});
        const data = await UserExchangeConfig.findOne({ userId });
        if (data) {
          await UserExchangeConfig.findOneAndUpdate(
            { userId },
            {
              $set: {
                config: {
                  apiKey: API_KEY,
                  apiSecret: API_SECRET,
                },
                connected: connectedStatus,
                walletAmount: userBalance.balance,
                exchangeId: exchangeId,
              },  
            }
          );
          return { success: true, code: 200, message: 'Binance Connected Sucessfully.'};
        }
        
      // }
    }else{
      return { success: false, code: 401, message: 'API key and secret already exist.'};
    }
   
    return { success: false, code: 401, message: 'API key and secret are not valid.'};
  } catch (error) {
    console.error('Error testing API key and secret:', error);
    return { success: true, code: 401, message: 'API key and secret are not valid.'};
  }
};

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfigById,
  updateUserExchangeConfigById,
  updateServerTokenById,
  getConnectedUser,
  getUserExchangeConfigByUserId,
  getConnectedUserExchangeConfig,
  getAllConnectionData,
  createAndConnectedConfig,
  getUserExchangeConfigByLogin,
  disconnectConnectionSubscription,
  updateStripeSubscription,
  disconnectConnection,
  getActiveUser,
  getConnectedAccountUser,
  activeConnection,
  updateBinanceSubscription,
  activeSubscription,
  saveBinanceApiKeyAndSecret,
  updateBinanceSubscriptionData,
  disconnectSubscription,
  updateBinanceApiKeyAndSecret,
};
