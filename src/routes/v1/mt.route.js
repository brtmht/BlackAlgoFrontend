const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
const mtController = require('../../controllers/mtaccount.controller');

const router = express.Router();

router.route('/mtAccount').get(mtController.getMtAccount).post(mtController.createMtAccount);
router.route('/mtBroker').get(mtController.getMtBroker).post(mtController.createMtBroker);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: MtAccount
 *   description: MT management and retrieval
 */
/**
 * @swagger
 * /mt/mtAccount:
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
 * /mt/mtBroker:
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
