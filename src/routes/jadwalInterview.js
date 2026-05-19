const express = require('express');
const router  = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const ctrl              = require('../controllers/jadwalInterviewController');

router.get('/saya',                  authenticateToken, authorizeRole('pelamar'),                                     ctrl.lihatJadwalSaya);
router.get('/lamaran/:id_lamaran',   authenticateToken, authorizeRole('pelamar', 'perusahaan', 'recruiter', 'admin'), ctrl.lihatJadwalPerLamaran);
router.get('/:id',                   authenticateToken, authorizeRole('pelamar', 'perusahaan', 'recruiter', 'admin'), ctrl.lihatJadwalById);
router.post('/',                     authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),            ctrl.buatJadwal);
router.put('/:id',                   authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),            ctrl.perbaruiJadwal);
router.patch('/:id/status',          authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),            ctrl.perbaruiStatusJadwal);
router.delete('/:id',                authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),            ctrl.hapusJadwal);

module.exports = router;
