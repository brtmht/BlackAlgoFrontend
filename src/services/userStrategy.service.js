/* eslint-disable no-case-declarations */
const httpStatus = require('http-status');
const { UserStrategy } = require('../models');
const ApiError = require('../utils/ApiError');
const { TransactionHistory } = require('../models');

/**
 * Create a userStrategy
 * @param {Object} userStrategyBody
 * @returns {Promise<UserStrategy>}
 */
const createUserStrategy = async (userStrategyBody, id) => {
  const userExist = await UserStrategy.findOne({ userId: id });
  const { step } = userStrategyBody;
  let strategyId;
  if (!userExist) {
    const userStrategydata = await UserStrategy.create({
      userId: id,
    });
    strategyId = userStrategydata.id;
  } else {
    strategyId = userExist._id;
  }
  let response;
  switch (step) {
    case 'strategy':
      await UserStrategy.updateOne(
        { _id: strategyId },
        {
          $set: {
            strategyId: userStrategyBody.strategyId,
          },
        }
      );
      break;
    case 'exchange':
      await UserStrategy.updateOne(
        { _id: strategyId },
        {
          $set: {
            exchangeId: userStrategyBody.exchangeId,
          },
        }
      );
      break;
    case 'use_futures':
      await UserStrategy.updateOne(
        { _id: strategyId },
        {
          $set: {
            use_futures: userStrategyBody.use_futures,
          },
        }
      );
      break;
    case 'plan':
      await UserStrategy.updateOne(
        { _id: strategyId },
        {
          $set: {
            subscriptionPlanId: userStrategyBody.subscriptionPlanId,
          },
        }
      );
      break;
    case 'payment':
      const transactionData = await TransactionHistory.findOne({ stripeTransactionId: userStrategyBody.paymentDetailId });
      if (transactionData) {
        await UserStrategy.updateOne(
          { _id: strategyId },
          {
            $set: {
              paymentDetailId: transactionData.paymentDetailId,
            },
          }
        );
      }
      break;
    case 'connectApi':
      response = '16';
      break;
    default:
      response = '';
      break;
  }
  // eslint-disable-next-line no-console
  console.log(response);
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
 * Get userStrategy by Userid
 * @param {ObjectId} id
 * @returns {Promise<UserStrategy>}
 */
const getUserStrategyByUserId = async (id) => {
  return UserStrategy.find({ userId: id });
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
  const userStrategyDeleted = await UserStrategy.findByIdAndUpdate(userStrategyId, { isDeleted: true });
  return userStrategyDeleted;
};

module.exports = {
  createUserStrategy,
  queryUserStrategies,
  getUserStrategyById,
  getUserStrategyByName,
  updateUserStrategyById,
  deleteUserStrategyById,
  getUserStrategyByUserId,
};
