const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller')
const router = express.Router();

router
  .route('/')
  .post(auth('managePayments'), validate(paymentValidation.createPayment), paymentController.createPayment)

router
  .route('/:paymentId')
  .get(auth('getPayments'), validate(paymentValidation.getPayment), paymentController.getPayment)
  .get(auth('getPayments'),validate(paymentValidation.getPaymentHistory),paymentController.getPaymentHistory)
module.exports = router;