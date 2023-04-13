/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { MtAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a exchange
 * @param {Object} mtAccountBody
 * @returns {Promise<MtAccount>}
 */
const createMtAccountNew = async (mtAccountBody) => {
  if (await MtAccount.isNameTaken(mtAccountBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return MtAccount.create(mtAccountBody);
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
const queryMTAccount = async (filter, options) => {
  const exchanges = await MtAccount.paginate(filter, options);
  return exchanges;
};

/**
 * Get exchange by id
 * @param {ObjectId} id
 * @returns {Promise<MtAccount>}
 */
const getMtAccountById = async (id) => {
  return MtAccount.findById(id);
};

/**
 * Get exchange by name
 * @param {string} name
 * @returns {Promise<MtAccount>}
 */
const getMtAccountByName = async (name) => {
  return MtAccount.findOne({ name });
};
/**
 * Update exchange by id
 * @param {ObjectId} mtAccountId
 * @param {Object} updateBody
 * @returns {Promise<MtAccount>}
 */
const updateMtAccountById = async (mtAccountId, updateBody) => {
  const exchange = await getMtAccountById(mtAccountId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MtAccount not found');
  }
  if (updateBody.name && (await MtAccount.isNameTaken(updateBody.name, mtAccountId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(exchange, updateBody);
  await exchange.save();
  return exchange;
};

/**
 * Delete exchange by id
 * @param {ObjectId} mtAccountId
 * @returns {Promise<MtAccount>}
 */
const deleteExchangeById = async (mtAccountId) => {
  const exchange = await getMtAccountById(mtAccountId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MtAccount not found');
  }
  await exchange.remove();
  return exchange;
};

module.exports = {
    createMtAccountNew,
    queryMTAccount,
    getMtAccountById,
  getMtAccountByName,
  updateMtAccountById,
  deleteExchangeById,
};
