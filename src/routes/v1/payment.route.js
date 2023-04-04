const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

// router
//   .route('/:userId')
//   .post(auth('managePayments'), validate(paymentValidation.createPayment), paymentController.createPayment)
router.post('/', auth('managePayments'), validate(paymentValidation.createPayment), paymentController.createPayment);
router.post(
  '/',
  auth('managePayments'),
  validate(paymentValidation.postPaymentDetails),
  paymentController.savePaymentDetails
);
router
  .route('/:paymentId')
  .get(auth('getPayments'), validate(paymentValidation.getPayment), paymentController.getPayment)
  .get(auth('getPayments'), validate(paymentValidation.getPaymentHistory), paymentController.getPaymentHistory);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management and retrieval
 */

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Create a payment using card and crypto
 *     description: User can create the plan payment using card and crypto .
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - country
 *               - phone
 *               - planId
 *               - paymentType
 *               - currency
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               paymentType:
 *                 type: string
 *                 enum: [card,crypto]
 *               currency:
 *                 type: string
 *               country:
 *                  type: string
 *             example:
 *               email: exampl'@'example.com
 *               phone: 8973655725
 *               amount: 100
 *               currency: inr
 *               country: india
 *               planId: 1875432376765
 *               paymentType: card
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/StripeAccount'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all payments
 *     description: Only admins can retrieve all subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: SubscriptionPlan name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of subscriptionPlans
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StripeAccount'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */