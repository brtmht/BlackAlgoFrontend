const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { globalConfig } = require('../services');
const { processFileData } = require('../middlewares/ftpData');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const getConfigData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({ success: true, code: 201, message: 'Exchange get Successfully', data: result });
});

const getTermAndPolicyData = catchAsync(async (req, res) => {
  const result = await globalConfig.getGlobalConfig();
  res.send({ success: true, code: 201, message: 'Privacy Policy Data', data: { content: result.term_policies } });
});

const graphData = catchAsync(async (req, res) => {

  // const filePath = '/home/ftp_blackalgo/ftp/trackrecord.csv';

  // const results = [];

  // fs.createReadStream(filePath)
  //   .pipe(csv())
  //   .on('data', (data) => results.push(data))
  //   .on('end', () => {
  //     console.log(results, "---------------");
  //     // res.json(results);
  //   })
  //   .on('error', (err) => {
  //     console.error('Error parsing CSV:', err);
  //     // res.status(500).send('Error parsing CSV');
  //   });

  const filePath = '/home/ftp_blackalgo/ftp/test.txt';
const absoluteFilePath = path.join(__dirname, '../..', filePath);

fs.readFile(absoluteFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    // Handle the error appropriately, e.g., return an error response
    return res.status(500).send('Error reading file');
  }

  // Process the file data
  console.log(data);

});
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
