const Joi = require('joi');
const model = require('../models/kategoriPekerjaanModel');

const skemaKategori = Joi.object({
  nama: Joi.string().required().messages({ 'any.required': 'nama wajib diisi.', 'string.empty': 'nama tidak boleh kosong.' }),
});

// GET /kategori-pekerjaan — semua role yang login
const lihatSemua = async (req, res, next) => {
  try {
    const kategori = await model.ambilSemua();
    res.json({ message: 'Kategori berhasil diambil.', data: kategori });
  } catch (err) { next(err); }
};

// POST /kategori-pekerjaan — admin buat kategori baru
const buatKategori = async (req, res, next) => {
  try {
    const { error, value } = skemaKategori.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { nama } = value;

    // Cek apakah nama kategori sudah ada
    const sudahAda = await model.ambilBerdasarkanNama(nama.trim());
    if (sudahAda) {
      return res.status(409).json({ message: 'Kategori dengan nama ini sudah ada.' });
    }

    const id = await model.buat(nama.trim());
    const kategori = await model.ambilBerdasarkanId(id);
    res.status(201).json({ message: 'Kategori berhasil dibuat.', data: kategori });
  } catch (err) { next(err); }
};

// PUT /kategori-pekerjaan/:id — admin update kategori
const perbaruiKategori = async (req, res, next) => {
  try {
    const { error, value } = skemaKategori.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { nama } = value;

    // Cek apakah kategori yang mau diupdate ada
    const kategori = await model.ambilBerdasarkanId(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    // Cek nama baru tidak bentrok dengan kategori lain
    const namaBentrok = await model.ambilBerdasarkanNama(nama.trim());
    if (namaBentrok && namaBentrok.id !== parseInt(req.params.id)) {
      return res.status(409).json({ message: 'Kategori dengan nama ini sudah ada.' });
    }

    await model.perbarui(req.params.id, nama.trim());
    const hasil = await model.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Kategori berhasil diupdate.', data: hasil });
  } catch (err) { next(err); }
};

// DELETE /kategori-pekerjaan/:id — admin hapus kategori
const hapusKategori = async (req, res, next) => {
  try {
    const kategori = await model.ambilBerdasarkanId(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    await model.hapus(req.params.id);
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (err) { next(err); }
};

module.exports = { lihatSemua, buatKategori, perbaruiKategori, hapusKategori };