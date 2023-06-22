const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userExchangeConfigValidation } = require('../../validations');
const { userExchangeConfigController } = require('../../controllers');

const router = express.Router();

router
  .route('/UserExchangeConfig')
  .post(auth('createUserExchangeConfig'), validate(userExchangeConfigValidation.createUserExchangeConfig), userExchangeConfigController.createUserExchangeConfig)
  .get(auth('getUserExchangeConfig'), userExchangeConfigController.getUserExchangeConfig)
  .patch(auth('updateUserExchangeConfig'), userExchangeConfigController.updateUserExchangeConfig);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UserExchangeConfig
 *   description: User Exchange Config management and retrieval
 */

/**
 * @swagger
 * /UserExchangeConfig:
 *   post:
 *     summary: Create a UserExchangeConfig
 *     description: Create a UserExchangeConfig using exchange and server.
 *     tags: [UserExchangeConfig]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exchangeId:
 *                 type: string
 *               config:
 *                 type: object
 *               strategyId:
 *                 type: string
 *             example:
 *               exchangeId: 646c543f6086f579abe86b58
 *               strategyId: 646c543f6086f579abe86b58
 *               config:
 *                   login: 260050728
 *                   password: abc
 *                   server: ICMarketsSC-Live26
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserExchangeConfig'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden' 
 *   get:
 *     summary: Get user exachange config
 *     description: Logged in users can fetch exachange config.
 *     tags: [UserExchangeConfig]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserExchangeConfig'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: update user exchange config
 *     description: update logged in user excahnge config.
 *     tags: [UserExchangeConfig]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exchangeId:
 *                 type: string
 *               config:
 *                 type: object
 *               strategyId:
 *                 type: string
 *             example:
 *               exchangeId: 646c543f6086f579abe86b58
 *               config:
 *                   login: 260050728
 *                   password: abc
 *                   server: ICMarketsSC-Live26
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserExchangeConfig'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'             
 */
