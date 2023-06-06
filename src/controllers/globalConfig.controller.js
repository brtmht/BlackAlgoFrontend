const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {globalConfig } = require('../services');


const getConfigData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send(result);
});

const getTermAndPolicyData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({"code":200, "message":"success", "data":result});
});

module.exports = {
  getConfigData,
  getTermAndPolicyData,
};
