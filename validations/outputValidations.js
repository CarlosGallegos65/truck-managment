import { check, validationResult } from 'express-validator';

// Validate data for a new account
const validateOutput =  async (req) => {

    await check('vehicle').trim().notEmpty().withMessage('Vehicle is required').run(req);

    return validationResult(req);
}

export {
    validateOutput
}