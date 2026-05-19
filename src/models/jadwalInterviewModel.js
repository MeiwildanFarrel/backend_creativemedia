const db = require('../config/database');

const ambilBerdasarkanIdLamaran = async (idLamaran) => {
  const [baris] = await db.query(
    'SELECT * FROM jadwal_interview WHERE id_lamaran = ? ORDER BY jadwal ASC',
    [idLamaran]
  );
  return baris;
};

const ambilBerdasarkanId = async (id) => {
  const [baris] = await db.query(
    'SELECT * FROM jadwal_interview WHERE id = ?',
    [id]
  );
  return baris[0];
};

const ambilJadwalSayaPelamar = async (idPelamar) => {
  const [baris] = await db.query(
    `SELECT ji.*, lk.judul AS judul_lowongan
     FROM jadwal_interview ji
     JOIN lamaran_kerja lam ON ji.id_lamaran = lam.id
     JOIN lowongan_kerja lk ON lam.id_lowongan = lk.id
     WHERE lam.id_pelamar = ? AND ji.status = 'terjadwal'
     ORDER BY ji.jadwal ASC`,
    [idPelamar]
  );
  return baris;
};

const buat = async ({ idLamaran, jadwal, lokasi, catatan }) => {
  const [hasil] = await db.query(
    'INSERT INTO jadwal_interview (id_lamaran, jadwal, lokasi, catatan) VALUES (?, ?, ?, ?)',
    [idLamaran, jadwal, lokasi, catatan]
  );
  return hasil.insertId;
};

const perbarui = async (id, { jadwal, lokasi, catatan }) => {
  const [hasil] = await db.query(
    'UPDATE jadwal_interview SET jadwal=?, lokasi=?, catatan=?, updated_at=NOW() WHERE id=?',
    [jadwal, lokasi, catatan, id]
  );
  return hasil.affectedRows;
};

const perbaruiStatus = async (id, status) => {
  const [hasil] = await db.query(
    'UPDATE jadwal_interview SET status=?, updated_at=NOW() WHERE id=?',
    [status, id]
  );
  return hasil.affectedRows;
};

const hapus = async (id) => {
  const [hasil] = await db.query(
    'DELETE FROM jadwal_interview WHERE id=?',
    [id]
  );
  return hasil.affectedRows;
};

module.exports = { ambilBerdasarkanIdLamaran, ambilBerdasarkanId, ambilJadwalSayaPelamar, buat, perbarui, perbaruiStatus, hapus };
