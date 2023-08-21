/* eslint-disable import/no-extraneous-dependencies */
const httpStatus = require('http-status');
const { toDataURL } = require('qrcode');
const { authenticator } = require('otplib');
const { User, UserWallet } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  const { name, email, password, role } = userBody;
  return User.create({
    name,
    email,
    password,
    role,
  });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  if (filter.role === 'admin') {
    const result = await User.paginate({ role: { $in: ['admin', 'manager'] } }, options);
    return result;
  }
  if (filter.monthlyUsers) {
    const result = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear() + 1, 0, 1),
          },
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    return result;
  }
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */

const updateUserDataById = async (userId, updateData) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const { file } = updateData;
  const updatedFilePath =  updateData?.file?.path?.replace(/\\/g, '/').replace('public/', '');
  if (file || Object.keys(updateData.body).length !== 0) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name: updateData.body.name ? updateData.body.name : user.name,
          discordId:  updateData.body.discordId ? updateData.body.discordId : user.discordId,
          image: updateData?.file?.path ? updatedFilePath : user.image,
        },
      }
    );
    return updatedUser;
  }
  throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Request data not found');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserPasword = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (await user.isPasswordMatch(updateBody.password)) {
    Object.assign(user, {
      password: updateBody.newPassword,
    });
    await user.save();
    return user;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Password does not match');
};

// Generate Two factor authentication secret
const generate2faSecret = async (user) => {
  const secret = authenticator.generateSecret();
  await User.findByIdAndUpdate(user._id, {
    google_2fa_secret: secret,
  });
  const otpAuthUrl = authenticator.keyuri(user.email, 'blackalgo', secret);
  return {
    secret,
    url: await toDataURL(otpAuthUrl),
  };
};
const turnOff2fa = async (user) => {
  const google2faData = await User.findByIdAndUpdate(user._id, {
    google_2fa_status: false,
  });
  return google2faData;
};

const verify2faSecret = async (req) => {
  const authCode = req.body.secret;
  
  const user = await User.findById(req.user._id);

  const googleSecret = user.google_2fa_secret;
  const isValid = authenticator.verify({ token: authCode, secret: googleSecret });
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST,"Invalid 2fa code");
  }
  return isValid;
};

const turnOn2fa = async (req) => {
  const turnOn2Fa = await verify2faSecret(req);
  if (turnOn2Fa) {
    await User.findByIdAndUpdate(req.user._id, {
      google_2fa_status: true,
    });
    return turnOn2Fa;
  }
  return turnOn2Fa;
};
const regenerate2faSecret = async (req) => {
  const isValid = await verify2faSecret(req);
  if (isValid) {
    const secret = authenticator.generateSecret();
    return {
      secret,
    };
  }
  throw new ApiError(httpStatus.NOT_FOUND);
};
const activateNew2faSecret = async (req) => {
  const googleSecret = req.body.google_2fa_secret;
  const userData = await User.findByIdAndUpdate(req.user._id, {
    google_2fa_secret: googleSecret,
  });
  return userData;
};

const getBackUpSecretKey = async (req) => {
  const user = await User.findById(req.user._id);
  if(user.google_2fa_secret===''){
    throw new ApiError(httpStatus.NOT_FOUND,"No 2FA found");
  }
  return user.google_2fa_secret;
};

/**
 * Get user data by secret key
 * @returns {Promise<User>}
 */
const getUserDataBy2faSecret = async (secret) => {
  const data = await User.findOne({ google_2fa_secret: secret });
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Backup key is invalid');
  }
  const userData = await User.findByIdAndUpdate(data._id, {
    google_2fa_secret: '',
    google_2fa_status: false,
  });
  return userData;
};

// admin Api
/**
 * Blocked user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const blockUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userBlocked = await User.findByIdAndUpdate(userId, { isBlocked: true });
  return userBlocked;
};

/**
 * Blocked user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const clearUserTokenById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userCleared = await User.findByIdAndUpdate(userId, { notificationToken: [] });
  return userCleared;
};
/**
 * Blocked user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const unBlockUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userBlocked = await User.findByIdAndUpdate(userId, { isBlocked: false });
  return userBlocked;
};
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userDeleted = await User.findByIdAndUpdate(userId, { isDeleted: true });
  return userDeleted;
};

const getUserWalletAmount = async (userId) => {
  const userWallet = await UserWallet.findOne({ userId });
  return userWallet;
};
/**
 * Delete user by id
 * @param {Object} reqData
 * @returns {Promise<User>}
 */
const uploadShareImage = async (reqData) => {
  if(!reqData.file){
    throw new ApiError(httpStatus.NOT_FOUND,'Image not found');
  }
  const { file } = reqData;
  const updatedFilePath =  reqData?.file?.path?.replace(/\\/g, '/').replace('public/', '');
  return updatedFilePath;
}
module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUserDataById,
  deleteUserById,
  updateUserPasword,
  generate2faSecret,
  verify2faSecret,
  turnOff2fa,
  turnOn2fa,
  regenerate2faSecret,
  activateNew2faSecret,
  getBackUpSecretKey,
  blockUserById,
  unBlockUserById,
  getUserWalletAmount,
  clearUserTokenById,
  getUserDataBy2faSecret,
  uploadShareImage,
};
