const { check } = require('express-validator');
const { validationResult } = require('express-validator');

exports.validateSignUpRequest = [
    check('firstName').notEmpty().withMessage('firstName is required'),
    check('lastName').notEmpty().withMessage('lastName is required'),
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({ min: 6 }).withMessage('Passwor must be at least 6 character long'),
];
exports.isValidatorsSignUp = (req, res, next) => {
    const error = validationResult(req);
    if (error.array().length > 0) {
        return res.status(202).json({
            errors: error.array()[0].msg,
        });
    }
    next();
};
