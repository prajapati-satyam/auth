const express = require('express');
const { registerUser, verifyUser, loginUser, resendMail } = require('../controller/user.controller');
const router = express.Router();

router.post('/register',registerUser);
router.get('/verify/:token', verifyUser)
router.post('/login', loginUser)
router.post('/resend', resendMail)


module.exports = router