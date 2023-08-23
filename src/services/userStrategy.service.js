/* eslint-disable no-case-declarations */
const httpStatus = require('http-status');
const { UserStrategy, Strategy } = require('../models');
const ApiError = require('../utils/ApiError');
const { TransactionHistory } = require('../models');
const { exchangeService } = require('.');

/**
 * Get all userStrategy data
 * @param {null}
 * @returns {Promise<UserStrategy>}
 */
const getUserData = async () => {
  const data = await UserStrategy.find()
    .populate({ path: 'userId', select: 'name' })
    .populate({ path: 'exchangeId', select: 'name' })
    .populate({ path: 'subscriptionPlanId', select: 'name' })
    .populate({ path: 'paymentDetailId', select: 'amount' });
  return data;
};
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
      use_futures: true,
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
      const transactionData = await TransactionHistory.findOne({
        transactionId: userStrategyBody.paymentDetailId,
        paymentStatus: 'success',
      });
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
  const response = await UserStrategy.findOne({ userId: id });
  const exchange = await exchangeService.getExchangeById(response.exchangeId);
  const {
    _id,
    userId,
    use_futures,
    onBoardProcess,
    isDeleted,
    status,
    createdAt,
    updatedAt,
    __v,
    strategyId,
    exchangeId,
    paymentDetailId,
    subscriptionPlanId,
  } = response._doc;

  const updatedResponse = {
    _id,
    userId,
    use_futures,
    onBoardProcess,
    isDeleted,
    status,
    createdAt,
    updatedAt,
    __v,
    strategyId,
    exchangeId,
    exchangeType: exchange ? exchange.type : '',
    paymentDetailId,
    subscriptionPlanId,
  };

  return updatedResponse;
};

/**
 * Get userStrategy by Userid and name
 * @param {ObjectId} id
 * @returns {Promise<UserStrategy>}
 */
const getStrategyByUserId = async (id) => {
  return UserStrategy.findOne({ userId: id }).populate('strategyId');
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
 * Get userStrategy by userId
 * @param {string} name
 * @returns {Promise<UserStrategy>}
 */
const getUserStrategyByUser = async (userId) => {
  return UserStrategy.findOne({ userId });
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
 * @param {ObjectId} strategyId
 * @param {Object} updateBody
 * @returns {Promise<UserStrategy>}
 */
const updateUserStrategyById = async (userId, updateBody) => {
  const userData = UserStrategy.findOneAndUpdate({ userId }, { ...updateBody });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserStrategy not found');
  }
  return userData;
};
/**
 * Delete userStrategy by id
 * @param {ObjectId} userStrategyId
 * @returns {Promise<UserStrategy>}
 */
const updateOnBoardStrategy = async (userId) => {
  const userStrategy = await UserStrategy.findOne({ userId });
  if (!userStrategy) {
    const userStrategydata = await UserStrategy.create({
      userId,
      onBoardProcess: true,
    });
    return userStrategydata;
  }
  const userStrategyUpdated = await UserStrategy.updateOne(
    { _id: userStrategy._id },
    {
      $set: {
        onBoardProcess: true,
      },
    }
  );
  return userStrategyUpdated;
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
  const userStrategyDeleted = await UserStrategy.findByIdAndUpdate(userStrategy._Id, { isDeleted: true });
  return userStrategyDeleted;
};

module.exports = {
  getUserData,
  createUserStrategy,
  queryUserStrategies,
  getUserStrategyById,
  getUserStrategyByName,
  updateUserStrategyById,
  deleteUserStrategyById,
  getUserStrategyByUserId,
  updateOnBoardStrategy,
  getStrategyByUserId,
  getUserStrategyByUser,
};
