import { check, validationResult } from 'express-validator';

// Validate data for a new account
const validateRegister = async (req) => {

    await Promise.all([
        check('name').trim().notEmpty().escape().withMessage('Name is required').run(req),
        check('email').trim().isEmail().normalizeEmail().withMessage('Invalid email').run(req),
        check('password').isLength({ min: 8 }).withMessage('Password needs a minimum of 8 characters').run(req),
        check('repeat_password').equals(req.body.password).withMessage('Password doesn\'t match ').run(req)
    ]);

    return validationResult(req);
}


// Valiate if the login data is correct
const validateLogin = async (req) => {

    await Promise.all([
        check('email').isEmail().withMessage('Email is required').run(req),
        check('password').notEmpty().withMessage('Password is required').run(req)
    ]);

    return validationResult(req);
}

// Validate if the email is an email
const validateEmail = async (req) => {
    
    await check('email').isEmail().withMessage('Email is required').run(req);
    return validationResult(req);
}

// Validate both passwords
const validatePassword = async (req) => {
    
    await Promise.all([
        check('password').isLength({ min: 8 }).withMessage('Password needs a minimum of 8 characters').run(req),
        check('repeat_password').equals(req.body.password).withMessage('Password doesn\'t match ').run(req)
    ]);

    return validationResult(req);
}

// Validate for changes from profile
const validateProfile = async (req) => {

    await check('name').trim().notEmpty().escape().withMessage('Name is required').run(req);

    return validationResult(req);
}

export {
    validateRegister,
    validateLogin,
    validateEmail,
    validatePassword,
    validateProfile
}