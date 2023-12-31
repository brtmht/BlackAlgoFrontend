const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { exchangeValidation } = require('../../validations');
const { exchangeController } = require('../../controllers');
const imageUploadMiddleware = require('../../middlewares/imageUpload');

const router = express.Router();

router
  .route('/')
  .post(
    auth('postExchanges'),
    imageUploadMiddleware('exchange'),
    validate(exchangeValidation.createExchange),
    exchangeController.createExchange
  )
  .get(auth('getExchanges'), validate(exchangeValidation.getExchanges), exchangeController.getExchanges);

router
  .route('/:exchangeId')
  .get(auth('getExchange'), validate(exchangeValidation.getExchange), exchangeController.getExchange)
  .patch(
    auth('manageExchanges'),
    imageUploadMiddleware('exchange'),
    validate(exchangeValidation.updateExchange),
    exchangeController.updateExchange
  )
  .delete(auth('manageExchanges'), validate(exchangeValidation.deleteExchange), exchangeController.deleteExchange);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Exchanges
 *   description: Exchange management and retrieval
 */

/**
 * @swagger
 * /exchanges:
 *   post:
 *     summary: Create a exchange
 *     description: Only admins can create other exchanges.
 *     tags: [Exchanges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *             example:
 *               name: fake name
 *               image: choose a image
 *               description: fake description
 *               url: fake@yopmail.com
 *     responses:
 *       "201":
 *         description: Created
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
 *
 *   get:
 *     summary: Get all exchanges
 *     description: Only admins can retrieve all exchanges.
 *     tags: [Exchanges]
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
 *                     $ref: '#/components/schemas/Exchange'
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
 * /exchanges/{id}:
 *   get:
 *     summary: Get a exchange
 *     description: Logged in exchanges can fetch only their own exchange information. Only admins can fetch other exchanges.
 *     tags: [Exchanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exchange id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Exchange'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a exchange
 *     description: Logged in exchanges can only update their own information. Only admins can update other exchanges.
 *     tags: [Exchanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exchange id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *             example:
 *               name: fake name
 *               image: choose a image
 *               description: fake description
 *               url: fake@yopmail.com
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
 *     summary: Delete a exchange
 *     description: Logged in exchanges can delete only themselves. Only admins can delete other exchanges.
 *     tags: [Exchanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exchange id
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
