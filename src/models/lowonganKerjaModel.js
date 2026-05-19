const db = require('../config/database');

const ambilSemua = async () => {
  const [baris] = await db.query(
    `SELECT lk.*, pp.nama_perusahaan, kp.nama AS nama_kategori
     FROM lowongan_kerja lk
     JOIN profil_perusahaan pp ON lk.id_perusahaan = pp.id
     JOIN kategori_pekerjaan kp ON lk.id_kategori = kp.id
     WHERE lk.status = 'buka'
     ORDER BY lk.created_at DESC`
  );
  return baris;
};

const ambilBerdasarkanId = async (id) => {
  const [baris] = await db.query(
    `SELECT lk.*, pp.nama_perusahaan, kp.nama AS nama_kategori
     FROM lowongan_kerja lk
     JOIN profil_perusahaan pp ON lk.id_perusahaan = pp.id
     JOIN kategori_pekerjaan kp ON lk.id_kategori = kp.id
     WHERE lk.id = ?`,
    [id]
  );
  return baris[0];
};

const ambilBerdasarkanIdPerusahaan = async (idPerusahaan) => {
  const [baris] = await db.query(
    `SELECT lk.*, pp.nama_perusahaan, kp.nama AS nama_kategori
     FROM lowongan_kerja lk
     JOIN profil_perusahaan pp ON lk.id_perusahaan = pp.id
     JOIN kategori_pekerjaan kp ON lk.id_kategori = kp.id
     WHERE lk.id_perusahaan = ?
     ORDER BY lk.created_at DESC`,
    [idPerusahaan]
  );
  return baris;
};

const buat = async ({ idPerusahaan, idKategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan }) => {
  const [hasil] = await db.query(
    `INSERT INTO lowongan_kerja
      (id_perusahaan, id_kategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [idPerusahaan, idKategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan]
  );
  return hasil.insertId;
};

const perbarui = async (id, { idKategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan }) => {
  const [hasil] = await db.query(
    `UPDATE lowongan_kerja
     SET id_kategori=?, judul=?, deskripsi=?, lokasi=?, keahlian_dibutuhkan=?,
         pendidikan_dibutuhkan=?, pengalaman_dibutuhkan=?, updated_at=NOW()
     WHERE id=?`,
    [idKategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan, id]
  );
  return hasil.affectedRows;
};

const perbaruiStatus = async (id, status) => {
  const [hasil] = await db.query(
    'UPDATE lowongan_kerja SET status=?, updated_at=NOW() WHERE id=?',
    [status, id]
  );
  return hasil.affectedRows;
};

const hapus = async (id) => {
  const [hasil] = await db.query(
    'DELETE FROM lowongan_kerja WHERE id = ?',
    [id]
  );
  return hasil.affectedRows;
};

module.exports = { ambilSemua, ambilBerdasarkanId, ambilBerdasarkanIdPerusahaan, buat, perbarui, perbaruiStatus, hapus };
