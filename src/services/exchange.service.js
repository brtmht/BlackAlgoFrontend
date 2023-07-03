const httpStatus = require('http-status');
const { Exchange } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a exchange
 * @param {Object} exchangeBody
 * @returns {Promise<Exchange>}
 */
const createExchange = async (exchangeBody) => {
  const { file } = exchangeBody;
  const updatedFilePath = exchangeBody?.file?.path?.replace(/\\/g, '/').replace('public/', '');
  if (file || Object.keys(exchangeBody.body).length !== 0) {
    const exchange = await Exchange.create({
      name: exchangeBody.body.name,
      description: exchangeBody.body.description,
      url: exchangeBody.body.url,
      image: updatedFilePath,
    });
    return exchange;
  }
  throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Request data not found');
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
  const exchanges = await Exchange.find({ status: true });
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
  const { file } = updateBody;
  const updatedFilePath = updateBody?.file?.path?.replace(/\\/g, '/').replace('public/', '');
  if (file || Object.keys(updateBody?.body).length !== 0) {
    const updateExchange = await Exchange.findOneAndUpdate(
      { _id: exchangeId },
      {
        $set: {
          name: updateBody.body.name,
          description: updateBody.body.description,
          url: updateBody.body.url,
          image: updatedFilePath,
        },
      }
    );
    return updateExchange;
  }
  throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Request data not found');
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
