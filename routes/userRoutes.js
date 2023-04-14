import express from 'express';
import {
    loginForm,
    login,
    registerForm,
    createAccount,
    confirm,
    forgotPasswordForm,
    resetPassword,
    compareToken,
    changePassword,
    logout
} from '../controllers/userController.js';

const router = express.Router();

// Log in
router.get('/login', loginForm);
router.post('/login', login);

// Create new account
router.get('/register', registerForm);
router.post('/register', createAccount);
router.get('/confirm/:token', confirm);

// Verify email to reset password
router.get('/forgot-password', forgotPasswordForm);
router.post('/forgot-password', resetPassword);

// Change password
router.get('/forgot-password/:token', compareToken);
router.post('/forgot-password/:token', changePassword);

// Close session
router.post('/logout', logout);

export default router;