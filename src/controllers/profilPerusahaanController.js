const Joi = require('joi');
const model = require('../models/profilPerusahaanModel');

const schemaProfil = Joi.object({
  nama_perusahaan : Joi.string().required().messages({ 'any.required': 'nama_perusahaan wajib diisi.', 'string.empty': 'nama_perusahaan tidak boleh kosong.' }),
  industri        : Joi.string().required().messages({ 'any.required': 'industri wajib diisi.', 'string.empty': 'industri tidak boleh kosong.' }),
  lokasi          : Joi.string().required().messages({ 'any.required': 'lokasi wajib diisi.', 'string.empty': 'lokasi tidak boleh kosong.' }),
  deskripsi       : Joi.string().required().messages({ 'any.required': 'deskripsi wajib diisi.', 'string.empty': 'deskripsi tidak boleh kosong.' }),
  situs_web       : Joi.string().uri().optional().allow('', null).messages({ 'string.uri': 'situs_web harus berupa URL yang valid (contoh: https://example.com).' }),
});


const lihatProfilSaya = async (req, res, next) => {
  try {
    const profil = await model.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profil) {
      return res.status(404).json({ message: 'Profil belum dibuat.' });
    }
    res.json({ message: 'Profil berhasil diambil.', data: profil });
  } catch (err) { next(err); }
};

const lihatProfilById = async (req, res, next) => {
  try {
    const profil = await model.ambilBerdasarkanId(req.params.id);
    if (!profil) {
      return res.status(404).json({ message: 'Profil tidak ditemukan.' });
    }
    res.json({ message: 'Profil berhasil diambil.', data: profil });
  } catch (err) { next(err); }
};

const lihatSemuaProfil = async (req, res, next) => {
  try {
    const profil = await model.ambilSemua();
    res.json({ message: 'Semua profil perusahaan berhasil diambil.', data: profil });
  } catch (err) { next(err); }
};

const buatProfil = async (req, res, next) => {
  try {
    const sudahAda = await model.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (sudahAda) {
      return res.status(409).json({ message: 'Profil sudah ada. Gunakan PUT untuk mengupdate.' });
    }

    const { error, value } = schemaProfil.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { nama_perusahaan, industri, lokasi, deskripsi, situs_web } = value;

    const url_logo = req.file ? `/uploads/${req.file.filename}` : null;

    const id = await model.buat({
      idPengguna: req.authUser.id,
      nama_perusahaan: nama_perusahaan.trim(),
      industri, lokasi, deskripsi, situs_web, url_logo
    });

    const profil = await model.ambilBerdasarkanId(id);
    res.status(201).json({ message: 'Profil perusahaan berhasil dibuat.', data: profil });
  } catch (err) { next(err); }
};

const perbaruiProfil = async (req, res, next) => {
  try {
    const sudahAda = await model.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!sudahAda) {
      return res.status(404).json({ message: 'Profil belum ada. Gunakan POST untuk membuat.' });
    }

    const { error, value } = schemaProfil.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { nama_perusahaan, industri, lokasi, deskripsi, situs_web } = value;

    const url_logo = req.file ? `/uploads/${req.file.filename}` : null;

    await model.perbarui(req.authUser.id, {
      nama_perusahaan: nama_perusahaan.trim(),
      industri, lokasi, deskripsi, situs_web, url_logo
    });

    const profil = await model.ambilBerdasarkanIdPengguna(req.authUser.id);
    res.json({ message: 'Profil perusahaan berhasil diupdate.', data: profil });
  } catch (err) { next(err); }
};

const hapusProfil = async (req, res, next) => {
  try {
    const profil = await model.ambilBerdasarkanId(req.params.id);
    if (!profil) {
      return res.status(404).json({ message: 'Profil perusahaan tidak ditemukan.' });
    }

    await model.hapus(req.params.id);
    res.json({ message: 'Profil perusahaan berhasil dihapus.', data: null });
  } catch (err) { next(err); }
};

module.exports = { lihatProfilSaya, lihatProfilById, lihatSemuaProfil, buatProfil, perbaruiProfil, hapusProfil };