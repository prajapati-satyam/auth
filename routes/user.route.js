const express = require('express');
const { registerUser, verifyUser, loginUser, resendMail, profile, resetPasswordRequest, verifyResetPasswordAndUpdate, forgotPasswordRequest, verifyForgotPasswordAndUpdate, profile_upload } = require('../controller/user.controller');
const { verifyLoginToken } = require('../middleware/user.middleware');
const check_file = require('../utils/custom_file_error');
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
router.post('/upload', verifyLoginToken, (req,res)=> {
    check_file(req,res);
});

module.exports = router