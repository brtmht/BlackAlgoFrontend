const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { strategyValidation } = require('../../validations');
const { strategyController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageStrategies'), validate(strategyValidation.createStrategy), strategyController.createStrategy)
  .get(auth(), validate(strategyValidation.getStrategies), strategyController.getStrategies);
router.route('/strategyWithoutAuth').get(validate(strategyValidation.getStrategies), strategyController.getStrategies);
router
  .route('/:strategyId')
  .get(auth('getStrategies'), validate(strategyValidation.getStrategy), strategyController.getStrategy)
  .patch(auth('manageStrategies'), validate(strategyValidation.updateStrategy), strategyController.updateStrategy)
  .delete(auth('manageStrategies'), validate(strategyValidation.deleteStrategy), strategyController.deleteStrategy);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Strategies
 *   description: Strategy management and retrieval
 */

/**
 * @swagger
 * /strategies:
 *   post:
 *     summary: Create a strategy
 *     description: Only admins can create other strategies.
 *     tags: [Strategies]
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
 *               - shortDescription
 *               - description
 *               - annual_return_percentage
 *               - monthly_return_percentage
 *               - risk_level
 *               - profit_factor
 *               - max_drawdown_percentage
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               annual_return_percentage:
 *                 type: number
 *               monthly_return_percentage:
 *                 type: number
 *               risk_level:
 *                 type: string
 *               profit_factor:
 *                 type: number
 *               max_drawdown_percentage:
 *                 type: number
 *             example:
 *               name: fake name
 *               shortDescription: short description
 *               description: fake description
 *               annual_return_percentage: 0
 *               monthly_return_percentage: 0
 *               min_portfolio: 2
 *               profit_factor: 2.1
 *               risk_level: low
 *               max_drawdown_percentage: 10
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Strategy'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all strategies
 *     description: Only admins can retrieve all strategies.
 *     tags: [Strategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Strategy name
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
 *         description: Maximum number of strategies
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
 *                     $ref: '#/components/schemas/Strategy'
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
 * /strategies/{id}:
 *   get:
 *     summary: Get a strategy
 *     description: Logged in strategies can fetch only their own strategy information. Only admins can fetch other strategies.
 *     tags: [Strategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Strategy id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Strategy'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a strategy
 *     description: Logged in strategies can only update their own information. Only admins can update other strategies.
 *     tags: [Strategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Strategy id
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
 *                $ref: '#/components/schemas/Strategy'
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
 *     summary: Delete a strategy
 *     description: Logged in strategies can delete only themselves. Only admins can delete other strategies.
 *     tags: [Strategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Strategy id
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
 * /strategies/strategyWithoutAuth:
*   get:
*     summary: Get all strategies
*     description: Only admins can retrieve all strategies.
*     tags: [Strategies]
*     parameters:
*       - in: query
*         name: name
*         schema:
*           type: string
*         description: Strategy name
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
*         description: Maximum number of strategies
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
*                     $ref: '#/components/schemas/Strategy'
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
