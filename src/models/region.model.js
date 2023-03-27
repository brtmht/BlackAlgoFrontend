const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const regionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
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
regionSchema.plugin(toJSON);
regionSchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The region's name
 * @param {ObjectId} [excludeRegionId] - The id of the region to be excluded
 * @returns {Promise<boolean>}
 */
regionSchema.statics.isNameTaken = async function (name, excludeRegionId) {
  const region = await this.findOne({ name, _id: { $ne: excludeRegionId } });
  return !!region;
};

/**
 * @typedef Region
 */
const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
