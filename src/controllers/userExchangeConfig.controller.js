const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userExchangeConfig } = require('../services');
const fs = require('fs');
const mt4Server = require('../middlewares/mt4Server');
const logger = require('../config/logger');

const createUserExchangeConfig = catchAsync(async (req, res) => {

  if(req.body.config.server){

    const maxAttempts = 3;
    let currentAttempt = 0; 

  const ipList = await mt4Server.getServerDataForIps();

  for (const ip of ipList) {
    logger.info(`Trying IP: ${ip}`);
    const response = await mt4Server.connect(req.body);
      if (response) {
        const exchangeConfig = await userExchangeConfig.createUserExchangeConfig(req.body,req.user);
        await userExchangeConfig.updateServerTokenById(exchangeConfig.id,response);

        res.status(httpStatus.CREATED).send(response);
        
      } else {
       logger.warning('API request failed, trying the next IP...');
      }
      currentAttempt++;
      if (currentAttempt === maxAttempts) {
        logger.warning('mt4 server connection Reached maximum attempts limit');
        break; // Exit the loop if maximum attempts reached
      }
  }
  logger.error('All IPs tried, none of them returned a successful response.');
  res.status(httpStatus.BAD_REQUEST).send('Cannot connect to any server: Invalid account');
  }
});

const getUserExchangeConfig = catchAsync(async (req, res) => {
  const userExchangeConfig = await userExchangeConfig.getUserExchangeConfigById(req.user._id);
  if (!userExchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User ExchangeConfig not found');
  }
  res.send(userExchangeConfig);
});

const updateUserExchangeConfig = catchAsync(async (req, res) => {
  const userExchangeConfig = await userExchangeConfig.updateUserExchangeConfigById(req.params.exchangeConfigId, req.body);
  res.send(userExchangeConfig);
});

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfig,
  updateUserExchangeConfig,
};
