/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mtBrokertSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    mtVersion: {
      type: String,
      default: '',
    },
    mtServerFile: {
      type: String,
      default: '',
    },
    brokerTimeZone: {
      type: String,
      default: '',
    },
    brokerDSTSwitchTimeZone: {
        type: String,
        default: '',
      },
    brokerTime: {
        type: String,
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
mtBrokertSchema.plugin(toJSON);
mtBrokertSchema.plugin(paginate);


/**
 * @typedef MtBroker
 */
const MtBroker = mongoose.model('MtBroker', mtBrokertSchema);

module.exports = MtBroker;
