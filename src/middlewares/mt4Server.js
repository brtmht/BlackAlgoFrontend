const config = require('../config/config');
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');

const Mt4Url = config.mt4Server.ApiUrl;
const connectSrv = async (data) => {
  try {
    const user = data.config.login;
    const password = data.config.password;
    const srvFile = data.config.server;

    const formData = new FormData();
    formData.append('user', user);
    formData.append('password', password);
    formData.append('srvFile', fs.createReadStream('./private_srv/MTServersConfig/' + srvFile + '.srv'));

    const config = {
      method: 'post',
      url: Mt4Url + 'ConnectSrv',
      headers: {
        accept: 'text/plain',
        ...formData.getHeaders(),
      },
      data: formData,
    };

    const response = await axios(config);
    logger.info("Mt4 User Token received");
    return response.data;
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error));
  }
};

const connect = async (data,hostName,portNumber) => {
  try {
    const user = data.config.login;
    const password = data.config.password;
    const host = hostName;
    const port = portNumber;

    console.log( `${Mt4Url}Connect?user=${user}&password=${password}&host=${host}&port=${port}`);
    var config = {
      method: 'get',
      url: `${Mt4Url}Connect?user=${user}&password=${password}&host=${host}&port=${port}`,
      headers: { 
        'accept': 'text/plain'
      }
    };
    
    const response = await axios(config);
    logger.info("Mt4 User Token received");
    return response.data;
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error));
  }
    
};
const orderSend = (data, user, lots) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      //url: `${Mt4Url}OrderSend?id=${user.serverToken}&symbol=${data?.Symbol}&operation=${data?.Type}&volume=${data?.Lots}`,
      url: `${Mt4Url}OrderSend?id=${user.serverToken}&symbol=${data?.Symbol}&operation=${data?.Type}&volume=${lots}&price=${data?.price}&stoploss=${data?.StopLoss}&takeprofit=${data?.TakeProfit}&comment=${data?.Comment}&magic=${data?.MagicNumber}&expiration=${data?.Expiration}`,
      headers: {
        accept: 'text/json',
      },
    };
    axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch(function (error) {
        //console.log(error);
        reject(error);
      });
  });
};

const accountSummary = (token) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      url: `${Mt4Url}AccountSummary?id=${token}`,
      headers: {
        accept: 'text/json',
      },
    };

    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const getServerData = async (serverName) => {
  try {
    const config = {
      method: 'get',
      url: `${Mt4Url}Search?company=${serverName}`,
      headers: {
        accept: 'text/json',
      },
    };

    const response = await axios(config);
    const data = response.data;
    if (data?.message) {
      logger.error(data?.message);
      throw new ApiError(httpStatus.NOT_FOUND, data?.message);
    }
    const namesList = data.flatMap((item) => item.results.map((result) => result.name));
    logger.info('Found Mt4 broker server data');
    return namesList; // Resolving the response data
  } catch (error) {
    console.log(error);
    throw error; // Rethrowing the error to be caught by the caller
  }
};

const getServerDataForIps = async (serverName) => {
  try {
    const config = {
      method: 'get',
      url: `${Mt4Url}Search?company=${serverName}`,
      headers: {
        accept: 'text/json',
      },
    };

    const response = await axios(config);
    const data = response.data;
    if (data?.message) {
      logger.error(data?.message);
      throw new ApiError(httpStatus.NOT_FOUND, data?.message);
    }

    // Find the result object that matches the target name
    const result = data.flatMap((item) => item.results).find((item) => item.name === serverName);

    // Get the access data for the target name
    const accessData = result.access;

    if (accessData) {
      logger.info('Found Mt4 company access data ');
      return accessData; // Resolving the response data
    } else {
      logger.warning('Cannot found Mt4 company access data ');
      throw error;
    }
  } catch (error) {
    logger.error('mt4 getServerDataForIps service is not working ');
    throw error; // Rethrowing the error to be caught by the caller
  }
};


module.exports = {
  connectSrv,
  connect,
  orderSend,
  accountSummary,
  getServerData,
  getServerDataForIps,
};
