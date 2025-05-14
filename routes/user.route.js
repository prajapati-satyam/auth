const express = require('express');
const { registerUser, verifyUser, loginUser, resendMail, profile, resetPasswordRequest, verifyResetPasswordAndUpdate } = require('../controller/user.controller');
const { verifyLoginToken } = require('../middleware/user.middleware');
const router = express.Router();

router.post('/register',registerUser);
router.get('/verify/:token', verifyUser)
router.post('/login', loginUser)
router.post('/resend', resendMail)
router.get('/me', verifyLoginToken, profile)
router.get('/reset-password/request', verifyLoginToken, resetPasswordRequest);
router.post('/reset-password/update', verifyResetPasswordAndUpdate);

module.exports = router