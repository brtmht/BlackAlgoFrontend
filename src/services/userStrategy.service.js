const httpStatus = require('http-status');
const { UserStrategy } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a userStrategy
 * @param {Object} userStrategyBody
 * @returns {Promise<UserStrategy>}
 */
const createUserStrategy = async (userStrategyBody) => {
  if (await UserStrategy.isNameTaken(userStrategyBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return UserStrategy.create(userStrategyBody);
};

/**
 * Query for userStrategies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserStrategies = async (filter, options) => {
  const userStrategies = await UserStrategy.paginate(filter, options);
  return userStrategies;
};

/**
 * Get userStrategy by id
 * @param {ObjectId} id
 * @returns {Promise<UserStrategy>}
 */
const getUserStrategyById = async (id) => {
  return UserStrategy.findById(id);
};

/**
 * Get userStrategy by name
 * @param {string} name
 * @returns {Promise<UserStrategy>}
 */
const getUserStrategyByName = async (name) => {
  return UserStrategy.findOne({ name });
};

/**
 * Update userStrategy by id
 * @param {ObjectId} userStrategyId
 * @param {Object} updateBody
 * @returns {Promise<UserStrategy>}
 */
const updateUserStrategyById = async (userStrategyId, updateBody) => {
  const userStrategy = await getUserStrategyById(userStrategyId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  if (updateBody.name && (await UserStrategy.isNameTaken(updateBody.name, userStrategyId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(userStrategy, updateBody);
  await userStrategy.save();
  return userStrategy;
};

/**
 * Delete userStrategy by id
 * @param {ObjectId} userStrategyId
 * @returns {Promise<UserStrategy>}
 */
const deleteUserStrategyById = async (userStrategyId) => {
  const userStrategy = await getUserStrategyById(userStrategyId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  await userStrategy.remove();
  return userStrategy;
};

module.exports = {
  createUserStrategy,
  queryUserStrategies,
  getUserStrategyById,
  getUserStrategyByName,
  updateUserStrategyById,
  deleteUserStrategyById,
};
