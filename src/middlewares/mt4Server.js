const config = require('../config/config');
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const {decryptData} = require('../middlewares/common');

const Mt4Url = config.mt4Server.ApiUrl;
const connectSrv = async (data) => {
  try {
    const user = data.config.login;
    const password = await decryptData(data.config.password);
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
    logger.info('Mt4 User Token received');
    return response.data;
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error));
  }
};

const connectWithOutEncryption = async (data, hostName, portNumber) => {
  try {
    const user = data.config.login;
    const password = data.config.password;
    const host = hostName;
    const port = portNumber;

    console.log(`${Mt4Url}Connect?user=${user}&password=${password}&host=${host}&port=${port}`);
    var config = {
      method: 'get',
      url: `${Mt4Url}Connect?user=${user}&password=${password}&host=${host}&port=${port}`,
      headers: {
        accept: 'text/plain',
      },
    };

    const response = await axios(config);
    logger.info('Mt4 User Token received');
    return response.data;
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error));
  }
};

const connect = async (data, hostName, portNumber) => {
  try {
    const user = data.config.login;
    const password = await decryptData(data.config.password);
    const host = hostName;
    const port = portNumber;

    console.log(`${Mt4Url}Connect?user=${user}&password=${password}&host=${host}&port=${port}`);
    var config = {
      method: 'get',
      url: `${Mt4Url}Connect?user=${user}&password=${password}&host=${host}&port=${port}`,
      headers: {
        accept: 'text/plain',
      },
    };

    const response = await axios(config);
    logger.info('Mt4 User Token received',response.data);
    return response.data;
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error));
  }
};
const orderSend = (data, BrokerToken, lots) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      //url: `${Mt4Url}OrderSend?id=${user.serverToken}&symbol=${data?.Symbol}&operation=${data?.Type}&volume=${data?.Lots}`,
      url: `${Mt4Url}OrderSend?id=${BrokerToken}&symbol=${data?.Symbol}&operation=${data?.Type}&volume=${lots}&slippage=3&price=${data?.price}&stoploss=${data?.StopLoss}&takeprofit=${data?.TakeProfit}&comment=${data?.Comment}&magic=${data?.MagicNumber}`,
      headers: {
        accept: 'text/json',
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response);
        if(response.data){
          logger.info('Mt4 Broker order send Successfully');
          resolve(response.data);
        }else if(response.message){
          logger.error('something wrong while Mt4 Broker order creating');
          resolve(response);
        }
      })
      .catch(function (error) {
        logger.error('Facing error while sending order');
        reject(error);
      });
  });
};

const orderModify = (data, BrokerToken, BrokerTicketId) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      //url: `${Mt4Url}OrderModify??id=demo-token-mt4&ticket=324589765&stoploss=0.233&takeprofit=0.5454&price=132&expiration=2022-02-12`,
      url: `${Mt4Url}OrderModify?id=${BrokerToken}&ticket=${BrokerTicketId}&stoploss=${data?.StopLoss.toFixed(3)}&takeprofit=${data?.TakeProfit.toFixed(3)}`,
      headers: {
        accept: 'text/json',
      },
    };
    console.log(config,"-----------------------config");
    axios(config)
      .then(function (response) {
        console.log(response.data);
        if(response.data){
          logger.info('Mt4 Broker order Modify Successfully');
          resolve(response.data);
        }else if(response.message){
          logger.error('something wrong while Mt4 Broker order modifiying');
          resolve(response);
        }
       
      })
      .catch(function (error) {
        console.log(error,"---------------------error");
        logger.error('Facing error while modify order');
        reject(error);
      });
  });
};

const checkOpenOrder = (BrokerToken, BrokerTicketId) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      //url: `${Mt4Url}OrderModify??id=demo-token-mt4&ticket=324589765&stoploss=0.233&takeprofit=0.5454&price=132&expiration=2022-02-12`,
      url: `${Mt4Url}OpenedOrder?id=${BrokerToken}&ticket=${BrokerTicketId}`,
      headers: {
        accept: 'text/json',
      },
    };
    axios(config)
      .then(function (response) {
          resolve(response); 
      })
      .catch(function (error) {
        console.log(error,"---------------------error");
        logger.error('Facing error while check open order');
        reject(error);
      });
  });
};

const checkConnection = (token) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      url: `${Mt4Url}CheckConnect?id=${token}`,
      headers: {
        accept: 'text/json',
      },
    };
    axios(config)
      .then(function (response) {
        logger.info('check mt4 connection');
        resolve(response.data);
      })
      .catch(function (error) {
        logger.error('Error in check mt4 connection api');
        reject(error);
      });
  });
};

const orderClose = (token, ticket, lots) => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      url: `${Mt4Url}OrderClose?id=${token}&ticket=${ticket}&lots=${lots}`,
      headers: {
        accept: 'text/json',
      },
    };
    axios(config)
      .then(function (response) {
       
        if(response.data){
          logger.info('Mt4 order closed successfully');
          resolve(response.data);
        }else if(response.message){
          logger.error('something wrong while Mt4 Broker order closing');
          resolve(response);
        }
      })
      .catch(function (error) {
        logger.error('An error occurred during the ordering process.');
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

const fxblueScript = (token) => {
  return new Promise((resolve, reject) => {
    var config = {
      method: 'get',
      url: 'https://www.fxblue.com/users/blackalgo/overviewscript',
      headers: {},
    };

    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
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
  orderClose,
  checkConnection,
  fxblueScript,
  connectWithOutEncryption,
  orderModify,
  checkOpenOrder,
};
