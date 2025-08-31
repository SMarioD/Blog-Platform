const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/authMiddleware');

router.get('/register', authController.showRegisterPage);
router.post('/register', authController.registerUser);
router.get('/login', authController.showLoginPage);
router.post('/login', authController.loginUser);

router.get('/logout', isAuthenticated, authController.logoutUser);

module.exports = router;