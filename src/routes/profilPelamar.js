const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const authorizeRole     = require('../middlewares/role');
const { uploadCV }      = require('../config/multer');
const ctrl              = require('../controllers/profilPelamarController');

// Pelamar: kelola profil diri sendiri
router.get('/saya', authenticateToken, authorizeRole('pelamar'), ctrl.lihatProfilSaya);
router.post('/',    authenticateToken, authorizeRole('pelamar'), uploadCV.single('cv'), ctrl.buatProfil);
router.put('/',     authenticateToken, authorizeRole('pelamar'), uploadCV.single('cv'), ctrl.perbaruiProfil);

// Admin: lihat semua profil pelamar
router.get('/',     authenticateToken, authorizeRole('admin'), ctrl.lihatSemuaProfil);

// Admin, recruiter, perusahaan: lihat profil pelamar tertentu
router.get('/:id',    authenticateToken, authorizeRole('admin', 'recruiter', 'perusahaan'), ctrl.lihatProfilById);

// Admin: hapus profil pelamar
router.delete('/:id', authenticateToken, authorizeRole('admin'), ctrl.hapusProfil);

module.exports = router;