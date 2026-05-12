const db = require('../config/database');

const ambilBerdasarkanIdPengguna = async (idPengguna) => {
  const [baris] = await db.query(
    'SELECT * FROM profil_perusahaan WHERE id_pengguna = ?',
    [idPengguna]
  );
  return baris[0];
};

const ambilBerdasarkanId = async (id) => {
  const [baris] = await db.query(
    'SELECT * FROM profil_perusahaan WHERE id = ?',
    [id]
  );
  return baris[0];
};

const ambilSemua = async () => {
  const [baris] = await db.query('SELECT * FROM profil_perusahaan');
  return baris;
};

const buat = async ({ idPengguna, nama_perusahaan, industri, lokasi, deskripsi, situs_web, url_logo }) => {
  const [hasil] = await db.query(
    `INSERT INTO profil_perusahaan
      (id_pengguna, nama_perusahaan, industri, lokasi, deskripsi, situs_web, url_logo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [idPengguna, nama_perusahaan, industri, lokasi, deskripsi, situs_web, url_logo]
  );
  return hasil.insertId;
};

const perbarui = async (idPengguna, { nama_perusahaan, industri, lokasi, deskripsi, situs_web, url_logo }) => {
  const [hasil] = await db.query(
    `UPDATE profil_perusahaan
     SET nama_perusahaan=?, industri=?, lokasi=?, deskripsi=?, situs_web=?,
         url_logo=COALESCE(?, url_logo), updated_at=NOW()
     WHERE id_pengguna=?`,
    [nama_perusahaan, industri, lokasi, deskripsi, situs_web, url_logo, idPengguna]
  );
  return hasil.affectedRows;
};

const hapus = async (id) => {
  const [hasil] = await db.query(
    'DELETE FROM profil_perusahaan WHERE id = ?',
    [id]
  );
  return hasil.affectedRows;
};

module.exports = { ambilBerdasarkanIdPengguna, ambilBerdasarkanId, ambilSemua, buat, perbarui, hapus };