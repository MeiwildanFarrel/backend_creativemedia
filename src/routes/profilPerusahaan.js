const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const { uploadGambar }  = require('../config/multer');
const ctrl              = require('../controllers/profilPerusahaanController');

// Perusahaan: kelola profil diri sendiri
router.get('/saya', authenticateToken, authorizeRole('perusahaan'), ctrl.lihatProfilSaya);
router.post('/',    authenticateToken, authorizeRole('perusahaan'), uploadGambar.single('logo'), ctrl.buatProfil);
router.put('/',     authenticateToken, authorizeRole('perusahaan'), uploadGambar.single('logo'), ctrl.perbaruiProfil);

// Admin: lihat semua profil perusahaan
router.get('/',     authenticateToken, authorizeRole('admin'), ctrl.lihatSemuaProfil);

// Semua role: lihat profil perusahaan tertentu
router.get('/:id',    authenticateToken, authorizeRole('admin', 'pelamar', 'recruiter', 'perusahaan'), ctrl.lihatProfilById);

// Admin: hapus profil perusahaan
router.delete('/:id', authenticateToken, authorizeRole('admin'), ctrl.hapusProfil);

module.exports = router;