const express = require('express');
const router  = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const ctrl              = require('../controllers/dashboardController');

router.get('/pelamar',    authenticateToken, authorizeRole('pelamar', 'admin'),              ctrl.dashboardPelamar);
router.get('/perusahaan', authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'), ctrl.dashboardPerusahaan);
router.get('/admin',      authenticateToken, authorizeRole('admin'),                            ctrl.dashboardAdmin);

module.exports = router;
