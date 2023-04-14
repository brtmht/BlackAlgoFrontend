const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const mtValidation = require('../../validations/mt.validation');
// eslint-disable-next-line import/extensions
const mtaccountController = require('../../controllers/mtAccount.controller.js');

const router = express.Router();

router
  .route('/mtAccount')
  .get(auth('getMtAccount'), validate(mtValidation.getMtAccount), mtaccountController.getMtAccount)
  .post(auth('postMtAccount'), validate(mtValidation.createMtAccount), mtaccountController.createMtAccount);

router
  .route('/:mtAccountId')
  .patch(auth('updateAccount'), mtaccountController.updateMtAccount)
  .delete(auth('deleteAccount'), mtaccountController.deleteMtAccount);
router
  .route('/mtBroker')
  .get(auth('getMtBroker'), validate(mtValidation.getMtBroker), mtaccountController.getMtBroker)
  .post(auth('postMtBroker'), validate(mtValidation.createMtBroker), mtaccountController.createMtBroker);

router
  .route('/mtBroker/:mtBrokerId')
  .patch(auth('updateBroker'), mtaccountController.updateMtBroker)
  .delete(auth('deleteBroker'), mtaccountController.deleteMtBroker);
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
 *         description: Region name
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
 *               name: black algo mt
 *               login: exampl@example.com
 *               password: password1
 *               serverName: server101
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
 * /mtAccount?mtAccountId:
 *   patch:
 *     summary: Update a MT Account
 *     description: Logged in users can only update their own information. Only admins can update other MT Account.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mtAccountId
 *         schema:
 *           type: string
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
 *               name: fake name
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
 *     summary: Delete a MT Account
 *     description: Logged in exchanges can delete only themselves. Only admins can delete other MT Account.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mtAccountId
 *         schema:
 *           type: string
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
 *         description: Region name
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
 *               name: black algo mt
 *               mtVersion: 2.09.4
 *               mtServerFile: mtFile.zip
 *               brokerTimeZone: 76-4y7ge-3er
 *               brokerDSTSwitchTimeZone: 5e6-7r56-e44
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
 * /mtBroker/mtbroker/?mtBrokerId:
 *   patch:
 *     summary: Update a MT Broker
 *     description: Logged in users can only update their own information. Only admins can update other MT Broker.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mtBrokerId
 *         schema:
 *           type: string
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
 *               name: fake name
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
 *     description: Logged in exchanges can delete only themselves. Only admins can delete other Broker.
 *     tags: [MtAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mtBrokerId
 *         schema:
 *           type: string
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
