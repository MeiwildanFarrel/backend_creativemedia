const Joi = require('joi');
const modelLamaran    = require('../models/lamaranKerjaModel');
const modelLowongan   = require('../models/lowonganKerjaModel');
const modelPelamar    = require('../models/profilPelamarModel');
const modelPerusahaan = require('../models/profilPerusahaanModel');
const hitungKecocokan = require('../utils/hitungKecocokan');

const STATUS_VALID = ['dilamar', 'ditinjau', 'interview', 'diterima', 'ditolak'];

const skemaLamaran = Joi.object({
  id_lowongan   : Joi.number().integer().required().messages({ 'any.required': 'id_lowongan wajib diisi.', 'number.base': 'id_lowongan harus berupa angka.' }),
  surat_lamaran : Joi.string().optional().allow('', null),
  url_cv        : Joi.string().optional().allow('', null),
});

const skemaStatusLamaran = Joi.object({
  status: Joi.string().valid(...STATUS_VALID).required().messages({
    'any.required': 'status wajib diisi.',
    'any.only'    : `status hanya boleh: ${STATUS_VALID.join(', ')}.`,
  }),
});

const lihatSemuaLamaran = async (req, res, next) => {
  try {
    const lamaran = await modelLamaran.ambilSemua();
    res.json({ message: 'Semua lamaran kerja berhasil diambil.', data: lamaran });
  } catch (err) { next(err); }
};

const lihatLamaranSaya = async (req, res, next) => {
  try {
    const profil = await modelPelamar.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profil) return res.status(404).json({ message: 'Profil pelamar tidak ditemukan.' });
    const lamaran = await modelLamaran.ambilBerdasarkanIdPelamar(profil.id);
    res.json({ message: 'Lamaran kerja berhasil diambil.', data: lamaran });
  } catch (err) { next(err); }
};

const lihatLamaranPerLowongan = async (req, res, next) => {
  try {
    const lowongan = await modelLowongan.ambilBerdasarkanId(req.params.id_lowongan);
    if (!lowongan) return res.status(404).json({ message: 'Lowongan tidak ditemukan.' });

    if (req.authUser.role === 'perusahaan') {
      const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      if (!profil || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });
      }
    }

    const lamaran = await modelLamaran.ambilBerdasarkanIdLowongan(req.params.id_lowongan);
    res.json({ message: 'Lamaran untuk lowongan berhasil diambil.', data: lamaran });
  } catch (err) { next(err); }
};

const lihatLamaranById = async (req, res, next) => {
  try {
    const lamaran = await modelLamaran.ambilBerdasarkanId(req.params.id);
    if (!lamaran) return res.status(404).json({ message: 'Lamaran tidak ditemukan.' });

    const { role, id: idPengguna } = req.authUser;

    if (role === 'pelamar') {
      const profil = await modelPelamar.ambilBerdasarkanIdPengguna(idPengguna);
      if (!profil || lamaran.id_pelamar !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }
    } else if (role === 'perusahaan') {
      const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(idPengguna);
      const lowongan = await modelLowongan.ambilBerdasarkanId(lamaran.id_lowongan);
      if (!profil || !lowongan || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }
    }

    res.json({ message: 'Detail lamaran berhasil diambil.', data: lamaran });
  } catch (err) { next(err); }
};

const buatLamaran = async (req, res, next) => {
  try {
    const profilPelamar = await modelPelamar.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profilPelamar) return res.status(400).json({ message: 'Buat profil pelamar terlebih dahulu.' });

    const { error, value } = skemaLamaran.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { id_lowongan, surat_lamaran, url_cv: urlCvInput } = value;

    const lowongan = await modelLowongan.ambilBerdasarkanId(id_lowongan);
    if (!lowongan) return res.status(404).json({ message: 'Lowongan tidak ditemukan.' });
    if (lowongan.status === 'tutup') return res.status(400).json({ message: 'Lowongan sudah ditutup.' });

    const sudahMelamar = await modelLamaran.cekSudahMelamar(id_lowongan, profilPelamar.id);
    if (sudahMelamar) return res.status(409).json({ message: 'Anda sudah melamar lowongan ini.' });

    const url_cv = urlCvInput || profilPelamar.url_cv;

    const id = await modelLamaran.buat({
      idLowongan: id_lowongan,
      idPelamar: profilPelamar.id,
      surat_lamaran,
      url_cv
    });

    const skor = hitungKecocokan(profilPelamar, lowongan);
    await modelLamaran.perbaruiSkorKecocokan(id, skor);

    const lamaran = await modelLamaran.ambilBerdasarkanId(id);
    res.status(201).json({ message: 'Lamaran kerja berhasil dikirim.', data: lamaran });
  } catch (err) { next(err); }
};

const perbaruiStatusLamaran = async (req, res, next) => {
  try {
    const { error, value } = skemaStatusLamaran.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { status } = value;

    const lamaran = await modelLamaran.ambilBerdasarkanId(req.params.id);
    if (!lamaran) return res.status(404).json({ message: 'Lamaran tidak ditemukan.' });

    if (req.authUser.role === 'perusahaan') {
      const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      const lowongan = await modelLowongan.ambilBerdasarkanId(lamaran.id_lowongan);
      if (!profil || !lowongan || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });
      }
    }

    await modelLamaran.perbaruiStatus(req.params.id, status);
    const updated = await modelLamaran.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Status lamaran berhasil diupdate.', data: updated });
  } catch (err) { next(err); }
};

const toggleShortlist = async (req, res, next) => {
  try {
    const lamaran = await modelLamaran.ambilBerdasarkanId(req.params.id);
    if (!lamaran) return res.status(404).json({ message: 'Lamaran tidak ditemukan.' });

    if (req.authUser.role === 'perusahaan') {
      const profil   = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      const lowongan = await modelLowongan.ambilBerdasarkanId(lamaran.id_lowongan);
      if (!profil || !lowongan || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });
      }
    }

    const shortlistedBaru = lamaran.shortlisted ? 0 : 1;
    await modelLamaran.perbaruiShortlisted(req.params.id, shortlistedBaru);
    const updated = await modelLamaran.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Status shortlist berhasil diupdate.', data: updated });
  } catch (err) { next(err); }
};

module.exports = { lihatSemuaLamaran, lihatLamaranSaya, lihatLamaranPerLowongan, lihatLamaranById, buatLamaran, perbaruiStatusLamaran, toggleShortlist };
