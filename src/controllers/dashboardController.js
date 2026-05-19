const db              = require('../config/database');
const modelPelamar    = require('../models/profilPelamarModel');
const modelPerusahaan = require('../models/profilPerusahaanModel');

const dashboardPelamar = async (req, res, next) => {
  try {
    const profil = await modelPelamar.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profil) return res.status(404).json({ message: 'Profil pelamar tidak ditemukan. Dashboard ini hanya tersedia untuk akun dengan profil pelamar aktif.' });

    const idPelamar = profil.id;

    const [[{ total_lamaran }]] = await db.query(
      'SELECT COUNT(*) AS total_lamaran FROM lamaran_kerja WHERE id_pelamar = ?',
      [idPelamar]
    );

    const [lamaranPerStatus] = await db.query(
      'SELECT status, COUNT(*) AS jumlah FROM lamaran_kerja WHERE id_pelamar = ? GROUP BY status',
      [idPelamar]
    );

    const [jadwalMendatang] = await db.query(
      `SELECT ji.*, lk.judul AS judul_lowongan
       FROM jadwal_interview ji
       JOIN lamaran_kerja lam ON ji.id_lamaran = lam.id
       JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
       WHERE lam.id_pelamar = ? AND ji.status = 'terjadwal'
       ORDER BY ji.jadwal ASC`,
      [idPelamar]
    );

    res.json({
      message: 'Dashboard pelamar berhasil diambil.',
      data: {
        total_lamaran,
        lamaran_per_status : lamaranPerStatus,
        jadwal_mendatang   : jadwalMendatang
      }
    });
  } catch (err) { next(err); }
};

const dashboardPerusahaan = async (req, res, next) => {
  try {
    const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profil) return res.status(404).json({ message: 'Profil perusahaan tidak ditemukan. Dashboard ini hanya tersedia untuk akun dengan profil perusahaan aktif.' });

    const idPerusahaan = profil.id;

    const [[statLowongan]] = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'buka' THEN 1 ELSE 0 END) AS buka,
              SUM(CASE WHEN status = 'tutup' THEN 1 ELSE 0 END) AS tutup
       FROM lowongan_kerja WHERE id_perusahaan = ?`,
      [idPerusahaan]
    );

    const [[{ total_lamaran }]] = await db.query(
      `SELECT COUNT(*) AS total_lamaran
       FROM lamaran_kerja lam
       JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
       WHERE lk.id_perusahaan = ?`,
      [idPerusahaan]
    );

    const [lamaranPerStatus] = await db.query(
      `SELECT lam.status, COUNT(*) AS jumlah
       FROM lamaran_kerja lam
       JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
       WHERE lk.id_perusahaan = ?
       GROUP BY lam.status`,
      [idPerusahaan]
    );

    const [lowonganTerbaru] = await db.query(
      `SELECT lk.id, lk.judul, lk.status, lk.created_at,
              COUNT(lam.id) AS jumlah_pelamar
       FROM lowongan_kerja lk
       LEFT JOIN lamaran_kerja lam ON lam.id_lowongan = lk.id
       WHERE lk.id_perusahaan = ?
       GROUP BY lk.id, lk.judul, lk.status, lk.created_at
       ORDER BY lk.created_at DESC
       LIMIT 5`,
      [idPerusahaan]
    );

    res.json({
      message: 'Dashboard perusahaan berhasil diambil.',
      data: {
        lowongan: {
          total: statLowongan.total,
          buka : statLowongan.buka,
          tutup: statLowongan.tutup
        },
        total_lamaran,
        lamaran_per_status: lamaranPerStatus,
        lowongan_terbaru  : lowonganTerbaru
      }
    });
  } catch (err) { next(err); }
};

const dashboardAdmin = async (req, res, next) => {
  try {
    const [[{ total_pengguna }]] = await db.query(
      'SELECT COUNT(*) AS total_pengguna FROM users'
    );

    const [penggunaPerRole] = await db.query(
      'SELECT role, COUNT(*) AS jumlah FROM users GROUP BY role'
    );

    const [[statLowongan]] = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'buka' THEN 1 ELSE 0 END) AS buka,
              SUM(CASE WHEN status = 'tutup' THEN 1 ELSE 0 END) AS tutup
       FROM lowongan_kerja`
    );

    const [[{ total_lamaran }]] = await db.query(
      'SELECT COUNT(*) AS total_lamaran FROM lamaran_kerja'
    );

    const [lamaranPerStatus] = await db.query(
      'SELECT status, COUNT(*) AS jumlah FROM lamaran_kerja GROUP BY status'
    );

    const [[{ total_kategori }]] = await db.query(
      'SELECT COUNT(*) AS total_kategori FROM kategori_pekerjaan'
    );

    res.json({
      message: 'Dashboard admin berhasil diambil.',
      data: {
        pengguna: {
          total   : total_pengguna,
          per_role: penggunaPerRole
        },
        lowongan: {
          total: statLowongan.total,
          buka : statLowongan.buka,
          tutup: statLowongan.tutup
        },
        lamaran: {
          total     : total_lamaran,
          per_status: lamaranPerStatus
        },
        total_kategori
      }
    });
  } catch (err) { next(err); }
};

module.exports = { dashboardPelamar, dashboardPerusahaan, dashboardAdmin };
