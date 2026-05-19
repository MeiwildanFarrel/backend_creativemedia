const express = require('express');
const router  = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const ctrl              = require('../controllers/lowonganKerjaController');

router.get('/saya',           authenticateToken, authorizeRole('perusahaan'),                          ctrl.lihatLowonganSayaPerusahaan);
router.get('/',               authenticateToken,                                                        ctrl.lihatSemuaLowongan);
router.get('/:id',            authenticateToken,                                                        ctrl.lihatLowonganById);
router.post('/',              authenticateToken, authorizeRole('perusahaan', 'recruiter'),              ctrl.buatLowongan);
router.put('/:id',            authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),     ctrl.perbaruiLowongan);
router.patch('/:id/status',   authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),   ctrl.perbaruiStatusLowongan);
router.delete('/:id',         authenticateToken, authorizeRole('perusahaan', 'recruiter', 'admin'),   ctrl.hapusLowongan);

module.exports = router;
