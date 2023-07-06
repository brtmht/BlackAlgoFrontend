const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userExchangeConfig, userStrategyService, userService, paymentDetailService } = require('../services');
const fs = require('fs');
const mt4Server = require('../middlewares/mt4Server');
const logger = require('../config/logger');

const createUserExchangeConfig = catchAsync(async (req, res) => {
  const existConfig = await userExchangeConfig.getUserExchangeConfigByLogin(req.body);
  if (existConfig) {
    res.status(406).send({
      success: false,
      error_code: 406,
      message: 'MT4 account already exists',
    });
  }
  if (!existConfig) {
    if (req.body.config.server) {
      const maxAttempts = 3;
      let currentAttempt = 0;
      let success = false; // Track if a successful response has been sent

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
            PORT = '443';
          }
          const response = await mt4Server.connectWithOutEncryption(req.body, IP, PORT);
          if (!response.message) {
            const existConnection = await userExchangeConfig.getUserExchangeConfigByUserId(req.user._id);
            if (existConnection) {
              await userExchangeConfig.updateServerTokenById(existConnection.id, response);
              res.send({
                success: true,
                code: 201,
                message: 'Mt4 server connection Update Succesfully',
                data: { token: response },
              });
            } else {
              const exchangeConfig = await userExchangeConfig.createUserExchangeConfig(req.body, req.user, response);
              res.send({
                success: true,
                code: 201,
                message: 'Check Mt4 server connection Succesfully',
                data: { token: response },
              });
            }
            success = true; // Set success flag to true
            break;
          } else {
            logger.warn('API request failed, trying the next IP...');
          }
          currentAttempt++;
          if (currentAttempt === maxAttempts) {
            logger.warn('MT4 server connection reached maximum attempts limit');
            break; // Exit the loop if maximum attempts reached
          }
        }
        if (!success) {
          logger.error('All IPs tried, none of them returned a successful response.');
          res.status(404).send({
            success: false,
            error_code: 404,
            message: 'Cannot connect to any server: Invalid account',
          });
        }
      } catch (error) {
        logger.error(`Error retrieving IP list: ${error.message}`);
        res.status(502).send({
          success: false,
          error_code: 502,
          message: 'Internal server error',
        });
      }
    }
  }
});

const getUserExchangeConfig = catchAsync(async (req, res) => {
  const exchangeConfig = await userExchangeConfig.getConnectedUserExchangeConfig(req.user._id);
  if (!exchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User ExchangeConfig not found');
  }
  res.send({ success: true, code: 201, message: 'Get user ExchangeConfig Succesfully', data: exchangeConfig });
});

const updateUserExchangeConfig = catchAsync(async (req, res) => {
  const existConfig = await userExchangeConfig.getUserExchangeConfigByLogin(req.body);

  if (existConfig) {
    res.status(406).send({
      success: false,
      error_code: 406,
      message: 'MT4 account already exists',
    });
  }
  if (req.body.config.server) {
    const maxAttempts = 3;
    let currentAttempt = 0;
    let success = false; // Track if a successful response has been sent

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
          PORT = '443';
        }
        const response = await mt4Server.connectWithOutEncryption(req.body, IP, PORT);
        if (!response.message) {
          const existConnection = await userExchangeConfig.getUserExchangeConfigByUserId(req.user._id);
          if (existConnection) {
            const exchangeConfig = await userExchangeConfig.updateUserExchangeConfigById(req.user._id, req.body, response);
            if (exchangeConfig) {
              const updatedData = await userExchangeConfig.getUserExchangeConfigByUserId(req.user._id);
              await userStrategyService.updateUserStrategyById(req.user._id, { exchangeId: req.body.exchangeId });
              success = true; // Set success flag to true
              res.send({
                success: true,
                code: 201,
                message: 'Mt4 connection update Succesfully',
                data: updatedData,
              });
              break; // Exit the loop if a successful response is sent
            } else {
              res.send({
                success: false,
                error_code: 400,
                message: 'Error while updating mt4 connection',
              });
              return; // Return early to prevent further execution
            }
          } else {
            const exchangeConfig = await userExchangeConfig.createAndConnectedConfig(req.body, req.user, response);
            success = true; // Set success flag to true
            res.send({
              success: true,
              code: 201,
              message: 'Mt4 connection create Succesfully',
              data: exchangeConfig,
            });
            break; // Exit the loop if a successful response is sent
          }
        } else {
          logger.warn('API request failed, trying the next IP...');
        }
        currentAttempt++;
        if (currentAttempt === maxAttempts) {
          logger.warn('MT4 server connection reached maximum attempts limit');
          break; // Exit the loop if maximum attempts reached
        }
      }

      if (!success) {
        logger.error('All IPs tried, none of them returned a successful response.');
        res.status(404).send({
          success: false,
          error_code: 404,
          message: 'Cannot connect to any server: Invalid account',
        });
      }
    } catch (error) {
      logger.error(`Error retrieving IP list: ${error.message}`);
      res.status(502).send({
        success: false,
        error_code: 502,
        message: 'Internal server error',
      });
    }
  }
});
const getAllConnectedUser = catchAsync(async (req, res) => {
  const exchangeConfig = await userExchangeConfig.getAllConnectionData(req.body);
  if (!exchangeConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  res.send({ success: true, code: 201, message: 'Get connected user list Succesfully', data: exchangeConfig });
});

const disconnectConnection = catchAsync(async (req, res) => {
  const userList = await userExchangeConfig.getConnectedUser();
  if (userList) {
    const subscriptionData = await paymentDetailService.getPaymentDataByUserId(userList.userId);
    if (subscriptionData) {
      const retrieve = await subscriptionPlanService.retrieveStripeSubsPlan(subscriptionData.subscriptionPlanId);
      if (retrieve) {
        const exchangeConfig = await userExchangeConfig.disconnectConnection(req.user._id);
        if (exchangeConfig) {
          logger.info(userList.userId,'Get connected user list Succesfully');
        } 
      }
    }
  } 
});

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfig,
  updateUserExchangeConfig,
  getAllConnectedUser,
  disconnectConnection,
};
