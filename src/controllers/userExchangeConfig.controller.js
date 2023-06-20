const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userExchangeConfig, userStrategyService } = require('../services');
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
          const response = await mt4Server.connectWithOutEncryption(req.body, IP, PORT);
          if (!response.message) {
           const existConnection = await userExchangeConfig.getUserExchangeConfigByUserId(req.user._id);
           if(existConnection){
            await userExchangeConfig.updateServerTokenById(existConnection.id, response);
           }else{
            const exchangeConfig = await userExchangeConfig.createUserExchangeConfig(req.body, req.user);
           }
            
            //await userExchangeConfig.updateServerTokenById(exchangeConfig.id, response);

            res.send({"success":true, code:201, "message":"Check Mt4 server connection Succesfully", "data":{"token":response}});
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
  
  if (req.body.config.server) {
    const maxAttempts = 3;
    let currentAttempt = 0;
console.log(req.body.config.server,"--------------------req.body.config.server");
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
          const response = await mt4Server.connectWithOutEncryption(req.body, IP, PORT);
          console.log(response,"-----------------------response-------------");
          if (!response.message) {
           const existConnection = await userExchangeConfig.getUserExchangeConfigByUserId(req.user._id);
           console.log(existConnection,"-----------------existConnection");
           if(existConnection){
            const exchangeConfig = await userExchangeConfig.updateUserExchangeConfigById(req.user._id, req.body, response);
            if(exchangeConfig){
              const updatedData= await userExchangeConfig.getUserExchangeConfigByUserId(req.user._id);
              await userStrategyService.updateUserStrategyById(req.user._id,{exchangeId:req.body.exchangeId});
              res.send({"success":true, code:201, "message":"Mt4 connection update Succesfully", "data":updatedData});
            }else{
              res.send({"success":false, "error_code":400, "message":"error while updating mt4 connection"});
            }
           }
           res.send({"success":false, "error_code":400, "message":"Data not found"});

            
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

module.exports = {
  createUserExchangeConfig,
  getUserExchangeConfig,
  updateUserExchangeConfig,
};
