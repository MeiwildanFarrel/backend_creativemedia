const express = require('express');
const router  = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const ctrl              = require('../controllers/lamaranKerjaController');

router.get('/saya',                  authenticateToken, authorizeRole('pelamar'),                                   ctrl.lihatLamaranSaya);
router.get('/',                      authenticateToken, authorizeRole('admin'),                                     ctrl.lihatSemuaLamaran);
router.get('/lowongan/:id_lowongan', authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),          ctrl.lihatLamaranPerLowongan);
router.get('/:id',                   authenticateToken, authorizeRole('pelamar', 'perusahaan', 'recruiter', 'admin'), ctrl.lihatLamaranById);
router.post('/',                     authenticateToken, authorizeRole('pelamar'),                                   ctrl.buatLamaran);
router.patch('/:id/status',    authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'), ctrl.perbaruiStatusLamaran);
router.patch('/:id/shortlist', authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'), ctrl.toggleShortlist);

module.exports = router;
