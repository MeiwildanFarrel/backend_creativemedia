const db = require('../config/database');

const ambilBerdasarkanIdPengguna = async (idPengguna) => {
  const [baris] = await db.query(
    'SELECT * FROM profil_pelamar WHERE id_pengguna = ?',
    [idPengguna]
  );
  return baris[0];
};

const ambilBerdasarkanId = async (id) => {
  const [baris] = await db.query(
    'SELECT * FROM profil_pelamar WHERE id = ?',
    [id]
  );
  return baris[0];
};

const ambilSemua = async () => {
  const [baris] = await db.query('SELECT * FROM profil_pelamar');
  return baris;
};

const buat = async ({ idPengguna, nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio }) => {
  const [hasil] = await db.query(
    `INSERT INTO profil_pelamar
      (id_pengguna, nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [idPengguna, nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio]
  );
  return hasil.insertId;
};

const perbarui = async (idPengguna, { nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio }) => {
  const [hasil] = await db.query(
    `UPDATE profil_pelamar
     SET nama_lengkap=?, telepon=?, lokasi=?, pendidikan=?, pengalaman=?, keahlian=?,
         url_cv=COALESCE(?, url_cv), bio=?, updated_at=NOW()
     WHERE id_pengguna=?`,
    [nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio, idPengguna]
  );
  return hasil.affectedRows;
};

const hapus = async (id) => {
  const [hasil] = await db.query(
    'DELETE FROM profil_pelamar WHERE id = ?',
    [id]
  );
  return hasil.affectedRows;
};

module.exports = { ambilBerdasarkanIdPengguna, ambilBerdasarkanId, ambilSemua, buat, perbarui, hapus };