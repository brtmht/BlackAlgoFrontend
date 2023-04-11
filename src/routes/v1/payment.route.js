const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router
  .route('/stripePayment')
  .get(auth(), paymentController.getStripeConfig)
  .post(auth('payment'), validate(paymentValidation.createPayment), paymentController.createPayment)
  .patch(auth('webhookResponse'), validate(paymentValidation.postPaymentDetails), paymentController.savePaymentDetails)
  .get(auth('history'), validate(paymentValidation.getPaymentHistory), paymentController.getPaymentHistory);
router.route('/binance').post(auth(), paymentController.postBinance).get(auth(), paymentController.getBinance);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management and retrieval
 */

/**
 * @swagger
 * /payment/stripePayment:
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
 *               email: exampl@example.com
 *               phone: "8973655725"
 *               amount: 100
 *               currency: inr
 *               country: india
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
 *   get:
 *     summary: Get transaction history
 *     description: User can see their past transaction history.
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Transaction Id
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
 *         description: Maximum number of transaction history
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
 *                     $ref: '#/components/schemas/TransactionHistory'
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
/**
 * @swagger
 * /stripe:
 *   patch:
 *     summary: Update your payment details
 *     description: User's payment details will be updated after this transaction is made.
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
 *               - transactionId
 *               - paymentStatus
 *               - planId
 *             properties:
 *               stripeTransactionId:
 *                 type: string
 *               planId:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *                 enum: [incomplete,pending,refunded,failed,completed,cancelled]
 *             example:
 *               paymentDetailId: "642c5224d1ad6a54f0407072"
 *               stripeTransactionId: "ipi_ue73f_4yei"
 *               paymentStatus: pending
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/PaymentDetail'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /binance:
 *   get:
 *     summary: Create a payment using card and crypto
 *     description: User can create the plan payment using card and crypto .
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
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
 */
/**
 * @swagger
 * /binance:
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
 *               email: exampl@example.com
 *               phone: "8973655725"
 *               amount: 100
 *               currency: inr
 *               country: india
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
 */
