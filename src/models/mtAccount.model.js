/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mtAccountSchema = mongoose.Schema(
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
    login: {
      type: String,
    },
    password: {
      type: String,
      default: '',
    },
    server: {
      type: String,
      default: '',
    },
    type: {
      type: String,
    },
    baseCurrency: {
      type: String,
    },
    copyFactoryRoles: {
      type: String,
    },
    connectionStatus: {
      type: String
    },
    manualTrading: {
      type: Boolean,
    },
    region: {
      type: String,
    },
    reliability:{
      type: String,
    },
    rersourceSlot: {
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
mtAccountSchema.plugin(toJSON);
mtAccountSchema.plugin(paginate);


/**
 * @typedef MtAccount
 */
const MtAccount = mongoose.model('MtAccount', mtAccountSchema);

module.exports = MtAccount;
