/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userWallet = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    currency: {
      type: String,
    },
    ammount: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userWallet.plugin(toJSON);
userWallet.plugin(paginate);


/**
 * @typedef MtAccount
 */
const wallet = mongoose.model('UserWallet', userWallet);

module.exports = wallet;
