const config = require('../config/config');
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');


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
        url: 'http://3.235.241.65:30400/ConnectSrv',
        headers: {
          'accept': 'text/plain',
          ...formData.getHeaders()
        },
        data: formData
      };
  
      const response = await axios(config);
      return response.data;
    } catch (error) {
        return next(new ApiError(httpStatus.BAD_REQUEST, error));
    }
  };

module.exports = {
    connectSrv,
  };