const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userExchangeConfig } = require('../services');
const fs = require('fs');
const mt4Server = require('../middlewares/mt4Server');
const logger = require('../config/logger');


const createUserExchangeConfig = catchAsync(async (req, res) => {
  if (req.body.config.server) {
    const maxAttempts = 3;
    let currentAttempt = 0;

    try {
      const ipList = await mt4Server.getServerDataForIps(req.body.config.server);
      for (const ip of ipList) {
        let IP;
        let PORT;
        const [address, port] = ip.split(':');
        logger.info(`Trying IP: ${ip}`);
        if (port) {
          IP = address;
          PORT = port;
        } else {
          IP = ip;
          PORT = "443";
        }
          const response = await mt4Server.connect(req.body, IP, PORT);
          if (!response.message) {
            const exchangeConfig = await userExchangeConfig.createUserExchangeConfig(req.body, req.user);
            await userExchangeConfig.updateServerTokenById(exchangeConfig.id, response);

            res.send({"success":true, "message":"Check Mt4 server connection Succesfully", "data":{"token":response}});
          } else {
            logger.warn('API request failed, trying the next IP...');
          }
        currentAttempt++;
        if (currentAttempt === maxAttempts) {
          logger.warn('MT4 server connection reached maximum attempts limit');
          break; // Exit the loop if maximum attempts reached
        }
      }

      logger.error('All IPs tried, none of them returned a successful response.');
      res.send({"success":false, "error_code":404, "message":"Cannot connect to any server: Invalid account"});
    } catch (error) {
      logger.error(`Error retrieving IP list: ${error.message}`);
      res.send({"success":false, "error_code":502, "message":"Internal server error"});
    }
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
