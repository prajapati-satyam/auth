const express = require('express');
const { registerUser, verifyUser, loginUser, resendMail, profile, resetPasswordRequest, verifyResetPasswordAndUpdate, forgotPasswordRequest, verifyForgotPasswordAndUpdate, profile_upload, delete_profile_picture, logout, send_reset_password_template, send_forgot_password_template } = require('../controller/user.controller');
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
router.get('/reset-password/update', send_reset_password_template);
router.post('/forgot-password/request', forgotPasswordRequest);
router.patch('/forgot-password/update', verifyForgotPasswordAndUpdate);
router.get('/forgot-password/update', send_forgot_password_template);
router.post('/upload', verifyLoginToken, (req,res)=> {
    check_file(req,res);
});
router.delete('/delete_profile_picture', delete_profile_picture);
router.get('/logout', logout)

module.exports = router