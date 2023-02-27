const express = require('express');
const router = express.Router();
// const modelsUser = require('../models/user');
const userController = require('../../controller/auth_user');
const validators = require('../../validators/validators');
const middleware = require('../../common-middleware/index');
router.post(
    '/admin/signUp',
    validators.validateSignUpRequest,
    validators.isValidatorsSignUp,
    userController.sigUpController,
);
router.post('/admin/signIn', userController.sigInController);
// router.post('/admin/signIn', userController.sigInController);
module.exports = router;
