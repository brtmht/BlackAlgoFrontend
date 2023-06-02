const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { tradingOrderValidation } = require('../../validations');
const { tradingController } = require('../../controllers');

const router = express.Router();

router
  .route('/tradingOrder')
  .post(
    auth('createTradingOrder'),
    validate(tradingOrderValidation.createTradingOrder),
    tradingController.createTradingOrder
  )
  .get(auth(), validate(tradingOrderValidation.getTradingOrder), tradingController.getTradingOrder);
router.route('/getOrdersWithPagination').get(auth(), tradingController.getTradingOrderWithPagination);
router.route('/getOrderLast24Hr').get(auth(), tradingController.getLast24HrTardingOrders);
router.route('/getOrderLast1Hr').get(auth(), tradingController.getLast1HrTardingOrders);
router.route('/getOrderLast1Week').get(auth(), tradingController.getLast1WeekTardingOrders);

router
  .route('/tradingOrder/:orderId')
  .get(auth('getTradingOrder'), validate(tradingOrderValidation.getTradingOrderById), tradingController.getTradingOrderById)
  .patch(
    auth('updateTradingOrder'),
    validate(tradingOrderValidation.updateTradingOrder),
    tradingController.updateTradingOrder
  )
  .delete(
    auth('deleteTradingOrder'),
    validate(tradingOrderValidation.deleteTradingOrder),
    tradingController.deleteTradingOrder
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TradingOrder
 *   description: TradingOrder management and retrieval
 */

/**
 * @swagger
 * /tradingOrder:
 *   post:
 *     summary: Create a tradingOrder
 *     description: Only admins can create other tradingOrder.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *             example:
 *               copiedTo: binance
 *               symbol: ETH
 *               digits: 0
 *               operation: buy
 *               volume: 0
 *               state: 0
 *               openPrice: 0
 *               sl: 0
 *               tp: 0
 *               reason: 0
 *               storage: 0
 *               closePrice: 0
 *               profit: 0
 *               taxes: 0
 *               magic: 0
 *               comment: ''
 *               activation: 0
 *               marginRate: 0
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TradingOrder'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tradingOrder
 *     description: Only admins can retrieve all tradingOrder.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: TradingOrder name
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
 *         description: Maximum number of tradingOrder
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
 *                     $ref: '#/components/schemas/TradingOrder'
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
 * /getOrdersWithPagination:
 *   get:
 *     summary: get a user's trading orders wit pagination
 *     description: Only logged in user can get trading orders.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of trading orders
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
 *                     $ref: '#/components/schemas/Notification'
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
 * /getOrderLast24Hr:
 *   get:
 *     summary: Get last 24Hr's user order
 *     description: Logged in user can fetch  their  trading order information for last 24 Hours.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TradingOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /getOrderLast1Hr:
 *   get:
 *     summary: Get last 1 Hour's user order
 *     description: Logged in user can fetch  their  trading order information for last 1 Hour.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TradingOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /getOrderLast1Week:
 *   get:
 *     summary: Get last 1 Week's user order
 *     description: Logged in user can fetch  their  trading order information from last 1 Week.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TradingOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /tradingOrder/{id}:
 *   get:
 *     summary: Get a trading order
 *     description: Logged in tradingOrder can fetch only their own trading order information. Only admins can fetch other tradingOrder.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TradingOrder id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TradingOrder'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a trading order
 *     description: Logged in tradingOrder can only update their own information. Only admins can update other tradingOrder.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TradingOrder id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userId:
 *                 type: string
 *               copiedTo:
 *                 type: string
 *                 enum: [binance,mt4]
 *               symbol:
 *                 type: string
 *               digits:
 *                 type: string
 *               operation:
 *                 type: string
 *                 enum: [buy, sell]
 *               volume:
 *                 type: number
 *               openTime:
 *                 type: date
 *               state:
 *                 type: number
 *               openPrice:
 *                 type: number
 *               sl:
 *                 type: number
 *               tp:
 *                 type: number
 *               closeTime:
 *                 type: date
 *               expiration:
 *                 type: date
 *               reason:
 *                 type: number
 *               commission:
 *                 type: number
 *               storage:
 *                 type: number
 *               closePrice:
 *                 type: number
 *               profit:
 *                 type: number
 *               taxes:
 *                 type: number
 *               magic:
 *                 type: number
 *               comment:
 *                 type: string
 *               activation:
 *                 type: number
 *               marginRate:
 *                 type: number
 *             example:
 *               copiedTo: binance
 *               symbol: ETH
 *               digits: 0
 *               operation: buy
 *               volume: 0
 *               state: 0
 *               openPrice: 0
 *               sl: 0
 *               tp: 0
 *               reason: 0
 *               storage: 0
 *               closePrice: 0
 *               profit: 0
 *               taxes: 0
 *               magic: 0
 *               comment: ''
 *               activation: 0
 *               marginRate: 0
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TradingOrder'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a trading order
 *     description: Logged in tradingOrder can delete only themselves. Only admins can delete other tradingOrder.
 *     tags: [TradingOrder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TradingOrder id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
