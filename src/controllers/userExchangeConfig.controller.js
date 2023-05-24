const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userExchangeConfig } = require('../services');
const fs = require('fs');
const mt4Server = require('../middlewares/mt4Server');

const createUserExchangeConfig = catchAsync(async (req, res) => {

// Check if the file exists
fs.access('./private_srv/MTServersConfig/' + req.body.config.server + '.srv', fs.constants.F_OK, async (err) => {
  if (err) {
   res.status(httpStatus.NOT_FOUND).send('Server file not found');
  } else {

    const mt4Response = await mt4Server.connectSrv(req.body);
    if(mt4Response.message){
      res.status(httpStatus.BAD_REQUEST).send("Cannot connect to any server: Invalid account");
    }else{

    const exchangeConfig = await userExchangeConfig.createUserExchangeConfig(req.body,req.user);
    await userExchangeConfig.updateServerTokenById(exchangeConfig.id,mt4Response);

    res.status(httpStatus.CREATED).send(exchangeConfig);
    }
    
  }
});
 
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
