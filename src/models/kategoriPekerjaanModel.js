const db = require('../config/database');

const ambilSemua = async () => {
  const [baris] = await db.query(
    'SELECT * FROM kategori_pekerjaan ORDER BY nama ASC'
  );
  return baris;
};

const ambilBerdasarkanId = async (id) => {
  const [baris] = await db.query(
    'SELECT * FROM kategori_pekerjaan WHERE id = ?',
    [id]
  );
  return baris[0];
};

const ambilBerdasarkanNama = async (nama) => {
  const [baris] = await db.query(
    'SELECT * FROM kategori_pekerjaan WHERE nama = ?',
    [nama]
  );
  return baris[0];
};

const buat = async (nama) => {
  const [hasil] = await db.query(
    'INSERT INTO kategori_pekerjaan (nama) VALUES (?)',
    [nama]
  );
  return hasil.insertId;
};

const perbarui = async (id, nama) => {
  const [hasil] = await db.query(
    'UPDATE kategori_pekerjaan SET nama=?, updated_at=NOW() WHERE id=?',
    [nama, id]
  );
  return hasil.affectedRows;
};

const hapus = async (id) => {
  const [hasil] = await db.query(
    'DELETE FROM kategori_pekerjaan WHERE id=?',
    [id]
  );
  return hasil.affectedRows;
};

module.exports = { ambilSemua, ambilBerdasarkanId, ambilBerdasarkanNama, buat, perbarui, hapus };