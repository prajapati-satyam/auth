const express = require('express');
const { registerUser, verifyUser } = require('../controller/user.controller');
const router = express.Router();

router.post('/register',registerUser);
router.get('/verify/:token', verifyUser)


module.exports = router