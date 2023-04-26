/* eslint-disable no-plusplus */
const httpStatus = require('http-status');
const { Support, SupportChat } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Support
 * @param {Object} supportBody
 * @param {id} userId
 * @returns {Promise<Support>}
 */
const createSupport = async (userId, supportBody) => {
  let support;
  support = await Support.find({ userId });
  if (support.length === 0) {
    support = await Support.create({
      userId,
    });
    const supportChat = await SupportChat.create({
      supportId: support._id,
      from: userId,
      to: supportBody.to,
      message: supportBody.message,
    });
    return supportChat;
  }
  const supportChat = await SupportChat.create({
    supportId: support[0]._id,
    from: userId,
    to: supportBody.to,
    message: supportBody.message,
  });
  return supportChat;
};

/**
 * Query for Supports
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySupports = async () => {
  // const data1 = await SupportChat.find().populate('supportId').exec();
  const data3 = await SupportChat.aggregate(
    [
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$supportId',
          lastData: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$lastData' } },
      {
        $lookup: {
          from: 'supports',
          localField: 'supportId',
          foreignField: '_id',
          as: 'data',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'userData',
        },
      },
    ],
    { $unwind: '$data' }
  );
  return { recentSupportChat: data3 };
};

/**
 * Get Support by id
 * @param {ObjectId} id
 * @returns {Promise<Support>}
 */
const getUsersMessageById = async (id) => {
  try {
    const results = await SupportChat.find({
      $or: [{ to: id }, { from: id }],
    });
    return results;
  } catch (err) {
    return err;
  }
};

/**
 * Get Support by id
 * @param {ObjectId} id
 * @returns {Promise<Support>}
 */
const getSupportById = async (id) => {
  return SupportChat.findById(id);
};
/**
 * Get Support by name
 * @param {string} name
 * @returns {Promise<Support>}
 */
const getSupportByName = async (name) => {
  return SupportChat.findOne({ name });
};
/**
 * Update Support by id
 * @param {ObjectId} supportChatId
 * @param {Object} updateBody
 * @returns {Promise<Support>}
 */
const updateSupportById = async (supportChatId, updateBody) => {
  const support = await getSupportById(supportChatId);
  if (!support) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Support not found');
  }
  const updateSupport = await SupportChat.findByIdAndUpdate(supportChatId, {
    ...updateBody,
  });

  return updateSupport;
};

/**
 * Delete Support by id
 * @param {ObjectId} supportChatId
 * @returns {Promise<Support>}
 */
const deleteSupportById = async (supportChatId) => {
  const support = await getSupportById(supportChatId);
  if (!support) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Support not found');
  }
  const supportDeleted = await SupportChat.findByIdAndUpdate(supportChatId, { isDeleted: true });
  return supportDeleted;
};

module.exports = {
  createSupport,
  querySupports,
  getUsersMessageById,
  getSupportByName,
  updateSupportById,
  deleteSupportById,
};
