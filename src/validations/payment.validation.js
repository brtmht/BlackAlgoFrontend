const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};


const getPayment = {
  params: Joi.object().keys({
    regionId: Joi.string().custom(objectId),
  }),
};

const getPaymentHistory = {
  params: Joi.object().keys({
    regionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};



module.exports = {
    createPayment,
    getPayment,
    getPaymentHistory
};
