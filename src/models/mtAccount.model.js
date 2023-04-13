/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mtAccountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    login: {
      type: String,
    },
    password: {
      type: String,
      default: '',
    },
    serverName: {
      type: String,
      default: '',
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
mtAccountSchema.plugin(toJSON);
mtAccountSchema.plugin(paginate);


/**
 * @typedef MtAccount
 */
const MtAccount = mongoose.model('MtAccount', mtAccountSchema);

module.exports = MtAccount;
