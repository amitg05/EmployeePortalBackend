const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../utils/authorization')
const { login, signup, logout, changePassword, refreshToken } = require('../../api/controllers/authController');

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', verifyToken, logout);
router.post('/change-password', verifyToken, changePassword);
router.post('/refresh-token', refreshToken);


module.exports = router;
