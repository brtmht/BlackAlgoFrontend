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
      url: Mt4Url +'ConnectSrv',
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

const webSocketEvents = async(token) =>{
  var config = {
    method: 'get',
    url:  Mt4Url +`/Events?id=${token}`,
    headers: { 
      'accept': 'text/json'
    }
  };

  console.log(config,"------------------------");
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error,"-------error");
  });
}

module.exports = {
  connectSrv,
  webSocketEvents,
};
