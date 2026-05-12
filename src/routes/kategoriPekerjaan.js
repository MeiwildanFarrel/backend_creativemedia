const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const ctrl              = require('../controllers/kategoriPekerjaanController');

// Semua yang sudah login bisa lihat kategori
router.get('/',      authenticateToken, ctrl.lihatSemua);

// Hanya admin yang bisa membuat, mengupdate, dan menghapus
router.post('/',     authenticateToken, authorizeRole('admin'), ctrl.buatKategori);
router.put('/:id',   authenticateToken, authorizeRole('admin'), ctrl.perbaruiKategori);
router.delete('/:id',authenticateToken, authorizeRole('admin'), ctrl.hapusKategori);

module.exports = router;