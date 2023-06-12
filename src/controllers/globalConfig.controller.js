const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {globalConfig } = require('../services');


const getConfigData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({"success":true, code:201 , "message":"Exchange get Successfully", "data":result});
});

const getTermAndPolicyData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({"success":true, code:201, "message":"Privacy Policy Data", "data": {content:result.term_policies}});
});

module.exports = {
  getConfigData,
  getTermAndPolicyData,
};
