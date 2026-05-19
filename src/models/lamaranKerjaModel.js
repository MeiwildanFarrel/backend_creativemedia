const db = require('../config/database');

const ambilSemua = async () => {
  const [baris] = await db.query(
    `SELECT lam.*, lk.judul AS judul_lowongan, pp.nama_lengkap
     FROM lamaran_kerja lam
     JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
     JOIN profil_pelamar pp ON lam.id_pelamar = pp.id
     ORDER BY lam.dilamar_pada DESC`
  );
  return baris;
};

const ambilBerdasarkanId = async (id) => {
  const [baris] = await db.query(
    `SELECT lam.*, lk.judul AS judul_lowongan, pp.nama_lengkap
     FROM lamaran_kerja lam
     JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
     JOIN profil_pelamar pp ON lam.id_pelamar = pp.id
     WHERE lam.id = ?`,
    [id]
  );
  return baris[0];
};

const ambilBerdasarkanIdPelamar = async (idPelamar) => {
  const [baris] = await db.query(
    `SELECT lam.*, lk.judul AS judul_lowongan, lk.lokasi AS lokasi_lowongan, lk.status AS status_lowongan
     FROM lamaran_kerja lam
     JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
     WHERE lam.id_pelamar = ?
     ORDER BY lam.dilamar_pada DESC`,
    [idPelamar]
  );
  return baris;
};

const ambilBerdasarkanIdLowongan = async (idLowongan) => {
  const [baris] = await db.query(
    `SELECT lam.*, pp.nama_lengkap, pp.keahlian, pp.lokasi AS lokasi_pelamar
     FROM lamaran_kerja lam
     JOIN profil_pelamar pp ON lam.id_pelamar = pp.id
     WHERE lam.id_lowongan = ?
     ORDER BY lam.dilamar_pada DESC`,
    [idLowongan]
  );
  return baris;
};

const cekSudahMelamar = async (idLowongan, idPelamar) => {
  const [baris] = await db.query(
    'SELECT * FROM lamaran_kerja WHERE id_lowongan = ? AND id_pelamar = ?',
    [idLowongan, idPelamar]
  );
  return baris[0];
};

const buat = async ({ idLowongan, idPelamar, surat_lamaran, url_cv }) => {
  const [hasil] = await db.query(
    `INSERT INTO lamaran_kerja (id_lowongan, id_pelamar, surat_lamaran, url_cv)
     VALUES (?, ?, ?, ?)`,
    [idLowongan, idPelamar, surat_lamaran, url_cv]
  );
  return hasil.insertId;
};

const perbaruiStatus = async (id, status) => {
  const [hasil] = await db.query(
    'UPDATE lamaran_kerja SET status=?, updated_at=NOW() WHERE id=?',
    [status, id]
  );
  return hasil.affectedRows;
};

const perbaruiSkorKecocokan = async (id, skor) => {
  const [hasil] = await db.query(
    'UPDATE lamaran_kerja SET skor_kecocokan=? WHERE id=?',
    [skor, id]
  );
  return hasil.affectedRows;
};

const perbaruiShortlisted = async (id, shortlisted) => {
  const [hasil] = await db.query(
    'UPDATE lamaran_kerja SET shortlisted=? WHERE id=?',
    [shortlisted, id]
  );
  return hasil.affectedRows;
};

module.exports = { ambilSemua, ambilBerdasarkanId, ambilBerdasarkanIdPelamar, ambilBerdasarkanIdLowongan, cekSudahMelamar, buat, perbaruiStatus, perbaruiSkorKecocokan, perbaruiShortlisted };
