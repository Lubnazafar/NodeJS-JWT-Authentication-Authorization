const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const schemas = require('../middleware/schemas');
const validateData = require('../middleware/schemaValidator');

router.post('/signup', validateData(schemas.signupSchema), userController.signup);

router.post('/login', validateData(schemas.loginSchema), userController.login);

router.post('/updateUser',  userController.updateUser);

router.get('/user/:userId', userController.checkIfLoggedin, userController.getUser);

/**
 * @swagger
 * definitions:
 *   Users:
 *     properties:
 *       name:
 *         type: string
 *       breed:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 */

router.get('/users', userController.checkIfLoggedin, userController.grantPermission('readAny', 'profile'), userController.getUsers);

router.delete('/user/:userId', userController.checkIfLoggedin, userController.grantPermission('deleteAny', 'profile'), userController.deleteUser);

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       breed:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */
/**
 * @swagger
 * /userData:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all puppies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of puppies
 */
router.get('/userData', userController.userData)

module.exports = router;