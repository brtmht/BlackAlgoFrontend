const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const mtValidation = require('../../validations/mt.validation');
// eslint-disable-next-line import/extensions
const mtaccountController = require('../../controllers/mtaccount.controller.js');

const router = express.Router();

router
  .route('/mtAccount')
  .get(auth('getMtAccount'), validate(mtValidation.getMtAccount), mtaccountController.getMtAccount)
  .post(auth('postMtAccount'), validate(mtValidation.createMtAccount), mtaccountController.createMtAccount);

router
  .route('/mtAccount/:mtAccountId')
  .get(auth('getMtAccountById'), validate(mtValidation.getMtAccountUsingId), mtaccountController.getMtAccountById)
  .patch(auth('updateMTAccount'), mtaccountController.updateMtAccount)
  .delete(auth('deleteAccount'), mtaccountController.deleteMtAccount);
router
  .route('/mtBroker')
  .get(auth('getMtBroker'), validate(mtValidation.getMtBroker), mtaccountController.getMtBroker)
  .post(auth('postMtBroker'), validate(mtValidation.createMtBroker), mtaccountController.createMtBroker);

router
  .route('/mtBroker/:mtBrokerId')
  .get(auth('getMtBrokerById'), validate(mtValidation.getMtBrokerUsingId), mtaccountController.getMtBrokerById)
  .patch(auth('updateBroker'), mtaccountController.updateMtBroker)
  .delete(auth('deleteBroker'), mtaccountController.deleteMtBroker);

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
 * /mtAccount:
 *   get:
 *     summary: MT Account handling
 *     description: User can create and get the mtAccount and MtBroker .
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: mtAccount name
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
 *         description: Maximum number of regions
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MtAccount'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create a MT Account
 *     description: User can create a MT Account here .
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
 *               - name
 *               - login
 *               - password
 *               - serverName
 *             properties:
 *               name:
 *                 type: string
 *               login:
 *                 type: string
 *               pasword:
 *                 type: string
 *               serverName:
 *                 type: string
 *             example:
 *               name: ICN - blackalgo@yopmail.com
 *               login: 60013069
 *               password: password1
 *               serverName: ICMmarketsSC-Live
 *               type: cloud-g0
 *               baseCurrency: USD
 *               copyFactoryRoles: SUBSCRIBER
 *               connectionStatus: connected
 *               manualTrading: true
 *               region: New-York
 *               reliability: High
 *               resourceSlot: 1
 *               isdeleted: false
 *               status: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MtAccount'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /mtAccount/{id}:
 *   patch:
 *     summary: Update a MT Account
 *     description: Logged in users can only update their own information. Only admins can update other MT Account.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MTAccount id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               serverName: ICMmarketsSC-Live
 *               type: cloud-g0
 *               baseCurrency: USD
 *               copyFactoryRoles: SUBSCRIBER
 *               connectionStatus: connected
 *               manualTrading: true
 *               region: New-York
 *               reliability: High
 *               resourceSlot: 1
 *               status: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MtAccount'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: get a MT Account by ID
 *     description: Logged in users can only get their own information.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MTAccount id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MtAccount'
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
 *     summary: Delete a MT Account
 *     description: Logged in exchanges can delete only themselves. Only admins can delete other MT Account.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MTAccount id
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

/**
 * @swagger
 * /mtBroker:
 *   get:
 *     summary: MT Broker handling
 *     description: User can create and get the mtAccount and MtBroker .
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: MT Broker name
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
 *         description: Maximum number of regions
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MtAccount'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create a MT Broker
 *     description: User can create a MT Broker here .
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
 *               - name
 *               - mtVersion
 *               - mtServerFile
 *               - brokerTimeZone
 *               - brokerDSTSwitchTimeZone
 *               - brokerTime
 *             properties:
 *               name:
 *                 type: string
 *               mtVersion:
 *                 type: string
 *               mtServerFile:
 *                 type: string
 *               brokerTimeZone:
 *                 type: string
 *               brokerDSTSwitchTimeZone:
 *                 type: string
 *               brokerTime:
 *                 type: string
 *               isDeleted:
 *                 type: boolean
 *               status:
 *                 type: boolean
 *             example:
 *               name: axi-0us3-Live
 *               mtVersion: mt4
 *               mtServerFile: mtFile.zip
 *               brokerTimeZone: EET
 *               brokerDSTSwitchTimeZone: America/New_york
 *               brokerTime: 16:44:23, 6/7/2024
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MtAccount'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /mtBroker/{id}:
 *   get:
 *     summary: get a MT Broker
 *     description: Logged in Broker can get only themselves.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MTBroker id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a MT Broker
 *     description: Logged in users can only update their own information. Only admins can update other MT Broker.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MTBroker id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: axi-0us3-Live
 *               mtVersion: mt4
 *               mtServerFile: mtFile.zip
 *               brokerTimeZone: EET
 *               brokerDSTSwitchTimeZone: America/New_york
 *               brokerTime: 16:44:23, 6/7/2024
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Exchange'
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
 *     summary: Delete a MT Broker
 *     description: Logged in brokers can delete only themselves. Only admins can delete other Broker.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MTBroker id
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
