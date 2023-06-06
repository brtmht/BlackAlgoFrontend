const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const { globalConfigController } = require('../../controllers');

const router = express.Router();

router
  .route('/globalConfig')
  .get(auth('getConfigData'), globalConfigController.getConfigData);
  router
  .route('/term&Policy')
  .get(auth('getTermAndPolicyData'), globalConfigController.getTermAndPolicyData);
  
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: GlobalConfig
 *   description: GlobalConfig management and retrieval
 */

/**
 * @swagger
 * /globalConfig:
 *   get:
 *     summary: Get global config Data
 *     description: Managed and retreived Global config data.
 *     tags: [GlobalConfig]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GlobalConfig'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */
/**
 * @swagger
 * /term&Policy:
 *   get:
 *     summary: Get term and policy Data
 *     description: Managed and retreived Term and policy data.
 *     tags: [GlobalConfig]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SucessResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */
