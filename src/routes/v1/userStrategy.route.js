const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userStrategyValidation } = require('../../validations');
const { userStrategyController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageUserStrategies'),
    validate(userStrategyValidation.createUserStrategy),
    userStrategyController.createUserStrategy
  )
  .get(
    auth('getUserStrategies'),
    validate(userStrategyValidation.getUserStrategies),
    userStrategyController.getUserStrategies
  )
  .patch(auth('updateOnBoarding'), userStrategyController.onBoardUserStrategy);
router.route('/userId').get(auth('getUserStrategiesByUserID'), userStrategyController.getUserStrategy);
router.route('/getAll').get(auth('getAllUserStrategies'), userStrategyController.getAllUserStrategy);
router
  .route('/:userStrategyId')
  .get(
    auth('getUserStrategies'),
    validate(userStrategyValidation.getUserStrategy),
    userStrategyController.getUserStrategyById
  )
  .patch(
    auth('manageUserStrategies'),
    validate(userStrategyValidation.updateUserStrategy),
    userStrategyController.updateUserStrategy
  )
  .delete(
    auth('manageUserStrategies'),
    validate(userStrategyValidation.deleteUserStrategy),
    userStrategyController.deleteUserStrategy
  );
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UserStrategies
 *   description: UserStrategy management and retrieval
 */

/**
 * @swagger
 * /userStrategies:
 *   post:
 *     summary: Create a userStrategy
 *     description: Only admins can create other userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: <h4>Options for step ( strategy,exchange,use_futures,plan,payment,connectApi).</h4>
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - strategyId
 *               - exchangeId
 *               - regionId
 *             properties:
 *               userId:
 *                 type: string
 *               strategyId:
 *                 type: string
 *               exchangeId:
 *                 type: string
 *               subscriptionPlanId:
 *                 type: string
 *               paymentDetailId:
 *                 type: string
 *               use_futures:
 *                 type: boolean
 *               step:
 *                 type: string
 *             example:
 *               strategyId: 5f0b9299f0f17200179d7e0f
 *               exchangeId: 5f0b9299f0f17200179d7e0f
 *               paymentDetailId: 642a8cea3554c041da1da346
 *               subscriptionPlanId: 642fab169ed2def7c1649dd2
 *               use_futures: false
 *               step: exchange
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserStrategy'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   patch:
 *     summary: update a userStrategy by token
 *     description: Logged in userStrategies can fetch only their own userStrategy information. Only admins can fetch other userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserStrategy'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   get:
 *     summary: Get all userStrategies
 *     description: Only admins can retrieve all userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Maximum number of userStrategies
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
 *                     $ref: '#/components/schemas/UserStrategy'
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
 * /userStrategies/userId:
 *   get:
 *     summary: Get a userStrategy by token
 *     description: Logged in userStrategies can fetch only their own userStrategy information. Only admins can fetch other userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserStrategy'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /userStrategies/{id}:
 *   get:
 *     summary: Get a userStrategy
 *     description: Logged in userStrategies can fetch only their own userStrategy information. Only admins can fetch other userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserStrategy id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserStrategy'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a userStrategy
 *     description: Logged in userStrategies can only update their own information. Only admins can update other userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserStrategy id
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
 *                $ref: '#/components/schemas/UserStrategy'
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
 *     summary: Delete a userStrategy
 *     description: Logged in userStrategies can delete only themselves. Only admins can delete other userStrategies.
 *     tags: [UserStrategies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserStrategy id
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
 * /userStrategies/getAll:
 *   get:
 *     summary: Get all Users's userStrategies
 *     description: Only admins can retrieve all userStrategies.
 *     tags: [UserStrategies]
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
 *                     $ref: '#/components/schemas/UserStrategy'
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
