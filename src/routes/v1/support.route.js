const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { supportValidation } = require('../../validations');
const { supportController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('createSupport'), validate(supportValidation.createSupport), supportController.createSupports)
  .get(auth('getAllSupport'), validate(supportValidation.getSupports), supportController.getSupports);

router
  .route('/:supportId')
  .get(auth('getSupport'), supportController.getUsersMessage)
  .patch(auth('patchSupport'), validate(supportValidation.updateSupport), supportController.updateSupport)
  .delete(auth('deleteSupport'), validate(supportValidation.deleteSupport), supportController.deleteSupport);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Support management and retrieval
 */

/**
 * @swagger
 * /support:
 *   post:
 *     summary: Create a support
 *     description: Only admins can create other support.
 *     tags: [Support]
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
 *               - description
 *             properties:
 *               message:
 *                 type: string
 *               to:
 *                 type: string
 *               from:
 *                 type: string
 *             example:
 *               message: This is my message
 *               to: 5ebac534954b54139806c112
 *               supportId: 5ebac534954b54139806c112
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SupportChat'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Recent Messages
 *     description: User can retrieve messages.
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/SupportChat'
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
 * /support/{id}:
 *   get:
 *     summary: Get user's messages
 *     description: Logged in users can fetch only their own support messages.
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SupportChat'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a support
 *     description: Logged in support can only update their own information. Only admins can update other support.
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: support id
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
 *                $ref: '#/components/schemas/SupportChat'
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
 *     summary: Delete a support
 *     description: Logged in support can delete only themselves. Only admins can delete other support.
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: support id
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
