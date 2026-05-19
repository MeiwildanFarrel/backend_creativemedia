const Joi = require('joi');
const model = require('../models/profilPelamarModel');

const schemaProfil = Joi.object({
  nama_lengkap : Joi.string().required().messages({ 'any.required': 'nama_lengkap wajib diisi.', 'string.empty': 'nama_lengkap tidak boleh kosong.' }),
  telepon      : Joi.string().required().messages({ 'any.required': 'telepon wajib diisi.', 'string.empty': 'telepon tidak boleh kosong.' }),
  lokasi       : Joi.string().required().messages({ 'any.required': 'lokasi wajib diisi.', 'string.empty': 'lokasi tidak boleh kosong.' }),
  pendidikan   : Joi.string().required().messages({ 'any.required': 'pendidikan wajib diisi.', 'string.empty': 'pendidikan tidak boleh kosong.' }),
  pengalaman   : Joi.string().required().messages({ 'any.required': 'pengalaman wajib diisi.', 'string.empty': 'pengalaman tidak boleh kosong.' }),
  keahlian     : Joi.string().required().messages({ 'any.required': 'keahlian wajib diisi.', 'string.empty': 'keahlian tidak boleh kosong.' }),
  bio          : Joi.string().optional().allow('', null),
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
    res.json({ message: 'Semua profil pelamar berhasil diambil.', data: profil });
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
    const { nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, bio } = value;

    const url_cv = req.file ? `/uploads/${req.file.filename}` : null;

    const id = await model.buat({
      idPengguna: req.authUser.id,
      nama_lengkap: nama_lengkap.trim(),
      telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio
    });

    const profil = await model.ambilBerdasarkanId(id);
    res.status(201).json({ message: 'Profil berhasil dibuat.', data: profil });
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
    const { nama_lengkap, telepon, lokasi, pendidikan, pengalaman, keahlian, bio } = value;

    const url_cv = req.file ? `/uploads/${req.file.filename}` : null;

    await model.perbarui(req.authUser.id, {
      nama_lengkap: nama_lengkap.trim(),
      telepon, lokasi, pendidikan, pengalaman, keahlian, url_cv, bio
    });

    const profil = await model.ambilBerdasarkanIdPengguna(req.authUser.id);
    res.json({ message: 'Profil berhasil diupdate.', data: profil });
  } catch (err) { next(err); }
};

const hapusProfil = async (req, res, next) => {
  try {
    const profil = await model.ambilBerdasarkanId(req.params.id);
    if (!profil) {
      return res.status(404).json({ message: 'Profil pelamar tidak ditemukan.' });
    }

    await model.hapus(req.params.id);
    res.json({ message: 'Profil pelamar berhasil dihapus.', data: null });
  } catch (err) { next(err); }
};

module.exports = { lihatProfilSaya, lihatProfilById, lihatSemuaProfil, buatProfil, perbaruiProfil, hapusProfil };