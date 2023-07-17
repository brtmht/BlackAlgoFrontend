const express = require('express');
const { transactionHistoryController } = require('../../controllers');
// const { paymentValidation } = require('../../validations');
// const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/getStripeHistory')
  .get(auth('getTransactionHistory'), transactionHistoryController.getStripeTransactionHistory);
router
  .route('/getCryptoHistory')
  .get(auth('getTransactionHistory'), transactionHistoryController.getCryptoTransactionHistory);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TransactionHistory
 *   description: TradingOrder management and retrieval
 */

/**
 * @swagger
 * /getStripeHistory:
 *   get:
 *     summary: Get transactions made with stripe only
 *     description: Logged in user can fetch  their  trading order information for last 24 Hours.
 *     tags: [TransactionHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/PaymentDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /getCryptoHistory:
 *   get:
 *     summary: Get transactions made with crypto only
 *     description: This api will filter and get only transaction made with crypto from database
 *     tags: [TransactionHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
