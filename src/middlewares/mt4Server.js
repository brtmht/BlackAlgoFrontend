const config = require('../config/config');
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

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

module.exports = {
  connectSrv,
  orderSend,
  accountSummary,
};
