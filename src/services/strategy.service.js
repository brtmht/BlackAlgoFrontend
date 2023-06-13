const httpStatus = require('http-status');
const { Strategy } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a strategy
 * @param {Object} strategyBody
 * @returns {Promise<Strategy>}
 */
const createStrategy = async (strategyBody) => {
  if (await Strategy.isNameTaken(strategyBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return Strategy.create(strategyBody);
};

/**
 * Query for strategies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStrategies = async (filter, options) => {
  const strategies = await Strategy.paginate(filter, options);
  return strategies;
};

/**
 * Get strategy by id
 * @param {ObjectId} id
 * @returns {Promise<Strategy>}
 */
const getStrategyById = async (id) => {
  return Strategy.findById(id);
};

/**
 * Get strategy by name
 * @param {string} name
 * @returns {Promise<Strategy>}
 */
const getStrategyByName = async (name) => {
  return Strategy.findOne({ name });
};

/**
 * Update strategy by id
 * @param {ObjectId} strategyId
 * @param {Object} updateBody
 * @returns {Promise<Strategy>}
 */
const updateStrategyById = async (strategyId, updateBody) => {
  const strategy = await getStrategyById(strategyId);
  if (!strategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Strategy not found');
  }

  const updateStrategy = await Strategy.findByIdAndUpdate(strategyId, {
    ...updateBody,
  });

  return updateStrategy;
};

/**
 * Update strategy by name
 * @param {string} strategyName
 * @param {Object} updateBody
 * @returns {Promise<Strategy>}
 */
const updateStrategyByName = async (strategyName, updateData) => {
  const strategy = await Strategy.findOne({ name:strategyName });
  if (!strategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Strategy not found');
  }

  const updateStrategy = await Strategy.findOneAndUpdate({name:strategyName}, {
    monthly_return_percentage: updateData.monthly_return_percentage,
    annual_return_percentage: updateData.annual_return_percentage,
    max_drawdown_percentage: updateData.max_drawdown_percentage,
    profit_factor: updateData.profit_factor,
  });

  return updateStrategy;
};


/**
 * Delete strategy by id
 * @param {ObjectId} strategyId
 * @returns {Promise<Strategy>}
 */
const deleteStrategyById = async (strategyId) => {
  const strategy = await getStrategyById(strategyId);
  if (!strategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Strategy not found');
  }
  const strategyDeleted = await Strategy.findByIdAndUpdate(strategyId, { isDeleted: true });
  return strategyDeleted;
};

module.exports = {
  createStrategy,
  queryStrategies,
  getStrategyById,
  getStrategyByName,
  updateStrategyById,
  deleteStrategyById,
  updateStrategyByName,
};
