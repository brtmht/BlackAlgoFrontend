const httpStatus = require('http-status');
const { UserStrategy } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a userStrategy
 * @param {Object} userStrategyBody
 * @returns {Promise<UserStrategy>}
 */
const createUserStrategy = async (userStrategyBody, userId) => {
  return UserStrategy.create({
    userId,
    ...userStrategyBody,
  });
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
  return UserStrategy.find({ userId: id });
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
const updateUserStrategyById = async (userId, updateBody) => {
  const userStrategy = await getUserStrategyById(userId);
  if (!userStrategy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  const userData = UserStrategy.findByIdAndUpdate(userStrategy._id, { ...updateBody });
  return userData;
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
