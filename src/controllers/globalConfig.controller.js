const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { globalConfig } = require('../services');
const { processFileData } = require('../middlewares/ftpData');

const getConfigData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({ success: true, code: 201, message: 'Exchange get Successfully', data: result });
});

const getTermAndPolicyData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({ success: true, code: 201, message: 'Privacy Policy Data', data: { content: result.term_policies } });
});

const graphData = catchAsync(async (req, res) => {
 await processFileData()
    .then((data) => {
      res.send({ success: true, code: 201, message: 'get Graph Data Successfully', data: { graphData: data } });
      // Use the data or pass it to another API as needed
    })
    .catch((error) => {
      throw new ApiError(httpStatus.NOT_FOUND, 'Error in processing file data');
    });
});

module.exports = {
  getConfigData,
  getTermAndPolicyData,
  graphData,
};
