/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { MtBroker } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a exchange
 * @param {Object} mtBrokerBody
 * @returns {Promise<MtBroker>}
 */

const createMtBrokerNew = async (mtBrokerBody) => {
  return MtBroker.create(mtBrokerBody);
};

/**
 * Query for exchanges
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMTBroker = async (filter, options) => {
  const exchanges = await MtBroker.paginate(filter, options);
  return exchanges;
};

/**
 * Get exchange by id
 * @param {ObjectId} id
 * @returns {Promise<MtBroker>}
 */
const getMtBrokerById = async (id) => {
  return MtBroker.findById(id);
};

/**
 * Get exchange by name
 * @param {string} name
 * @returns {Promise<MtBroker>}
 */
const getMtBrokerByName = async (name) => {
  return MtBroker.findOne({ name });
};
/**
 * Update exchange by id
 * @param {ObjectId} mtBrokerId
 * @param {Object} updateBody
 * @returns {Promise<MtBroker>}
 */
const updateMtBrokerById = async (mtBrokerId, updateBody) => {
  const exchange = await getMtBrokerById(mtBrokerId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MtBroker not found');
  }
  if (updateBody.name && (await MtBroker.isNameTaken(updateBody.name, mtBrokerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(exchange, updateBody);
  await exchange.save();
  return exchange;
};

/**
 * Delete exchange by id
 * @param {ObjectId} mtBrokerId
 * @returns {Promise<MtBroker>}
 */
const deleteMtBrokerById = async (mtBrokerId) => {
  const exchange = await getMtBrokerById(mtBrokerId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MtBroker not found');
  }
  await exchange.remove();
  return exchange;
};

module.exports = {
  createMtBrokerNew,
  queryMTBroker,
  getMtBrokerById,
  getMtBrokerByName,
  updateMtBrokerById,
  deleteMtBrokerById,
};
