const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const supportSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
supportSchema.plugin(toJSON);
supportSchema.plugin(paginate);

/**
 * @typedef Support
 */
const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
