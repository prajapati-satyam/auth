const express = require('express');
const { registerUser, verifyUser, loginUser, resendMail, profile, resetPasswordRequest, verifyResetPasswordAndUpdate, forgotPasswordRequest, verifyForgotPasswordAndUpdate } = require('../controller/user.controller');
const { verifyLoginToken } = require('../middleware/user.middleware');
const router = express.Router();

router.post('/register',registerUser);
router.get('/verify/:token', verifyUser)
router.post('/login', loginUser)
router.post('/resend', resendMail)
router.get('/me', verifyLoginToken, profile)
router.get('/reset-password/request', verifyLoginToken, resetPasswordRequest);
router.patch('/reset-password/update', verifyResetPasswordAndUpdate);
router.post('/forgot-password/request', forgotPasswordRequest);
router.patch('/forgot-password/update', verifyForgotPasswordAndUpdate)

module.exports = router