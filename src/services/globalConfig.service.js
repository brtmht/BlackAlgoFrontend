const httpStatus = require('http-status');
const { GlobalConfig } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get user by id
 * @returns {Promise<GlobalConfig>}
 */
const getGlobalConfig = async () => {
  return GlobalConfig.findOne();
};

module.exports = {
  getGlobalConfig,
};
