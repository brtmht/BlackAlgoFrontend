const httpStatus = require('http-status');
const { Exchange } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a exchange
 * @param {Object} exchangeBody
 * @returns {Promise<Exchange>}
 */
const createExchange = async (exchangeBody) => {
  if (await Exchange.isNameTaken(exchangeBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return Exchange.create(exchangeBody);
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
const getExchanges = async () => {
  const exchanges = await Exchange.find({status:true});
  return exchanges;
};

/**
 * Get exchange by id
 * @param {ObjectId} id
 * @returns {Promise<Exchange>}
 */
const getExchangeById = async (id) => {
  return Exchange.findById(id);
};

/**
 * Get exchange by name
 * @param {string} name
 * @returns {Promise<Exchange>}
 */
const getExchangeByName = async (name) => {
  return Exchange.findOne({ name });
};
/**
 * Update exchange by id
 * @param {ObjectId} exchangeId
 * @param {Object} updateBody
 * @returns {Promise<Exchange>}
 */
const updateExchangeById = async (exchangeId, updateBody) => {
  const exchange = await getExchangeById(exchangeId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
  }
  const updateExchange = await Exchange.findByIdAndUpdate(exchangeId, {
    ...updateBody,
  });

  return updateExchange;
};

/**
 * Delete exchange by id
 * @param {ObjectId} exchangeId
 * @returns {Promise<Exchange>}
 */
const deleteExchangeById = async (exchangeId) => {
  const exchange = await getExchangeById(exchangeId);
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
  }
  const exchangeDeleted = await Exchange.updateUserById(exchangeId, { isDeleted: true });
  return exchangeDeleted;
};

module.exports = {
  createExchange,
  getExchanges,
  getExchangeById,
  getExchangeByName,
  updateExchangeById,
  deleteExchangeById,
};
