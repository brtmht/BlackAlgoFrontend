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
router.route('/getTransactionHistoryLast24Hr').get(auth(), transactionHistoryController.getLast24HrTransactionHistory);
router.route('/getTransactionHistoryLast1Week').get(auth(), transactionHistoryController.getLast1WeekTransactionHistory);
router.route('/getTransactionHistoryLast30Days').get(auth(), transactionHistoryController.getLast1MonthTransactionHistory);
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
/**
 * @swagger
 * /getTransactionHistoryLast24Hr:
 *   get:
 *     summary: Get last 24Hr's Transaction History
 *     description: Admin can fetch  their  TransactionHistory  information from last 24 Hours.
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
 * /getTransactionHistoryLast1Week:
 *   get:
 *     summary: Get last 1 Week's TransactionHistory
 *     description: Admin can fetch  their  TransactionHistory  information from last 1 Week.
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
 * /getTransactionHistoryLast30Days:
 *   get:
 *     summary: Get last 30 days TransactionHistory
 *     description: Admin can fetch   TransactionHistory order information from last 30 Days.
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
