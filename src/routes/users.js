const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/role');

const router = express.Router();

router.get('/profile', authenticateToken, authorizeRole('admin', 'pelamar', 'perusahaan', 'recruiter'), userController.getProfile);

module.exports = router;