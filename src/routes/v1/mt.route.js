const express = require('express');
const auth = require('../../middlewares/auth');
// eslint-disable-next-line import/extensions
const mtaccountController = require('../../controllers/mtaccount.controller.js');

const router = express.Router();

router.route('/ServerList').post(auth('ServerList'), mtaccountController.getServerData);
router.route('/FxblueScript').get(mtaccountController.FxblueScript);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: MtAccount
 *   description: MT management and retrieval
 */
/**
 * @swagger
 * /ServerList:
 *   post:
 *     summary: Get server list data according to broker
 *     description: Get specific server data list .
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serverName
 *             properties:
 *               serverName:
 *                 type: string;
 *             example:
 *               serverName: bybit
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ServerList'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /FxblueScript:
 *   get:
 *     summary: Get FxBlue script data
 *     description: Get fxBlue data list .
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SucessResponse'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
