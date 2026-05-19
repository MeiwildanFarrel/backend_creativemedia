const Joi = require('joi');
const modelLowongan   = require('../models/lowonganKerjaModel');
const modelPerusahaan = require('../models/profilPerusahaanModel');

const skemaLowongan = Joi.object({
  id_perusahaan         : Joi.number().integer().optional(),
  id_kategori           : Joi.number().required().messages({ 'any.required': 'id_kategori wajib diisi.', 'number.base': 'id_kategori harus berupa angka.' }),
  judul                 : Joi.string().required().messages({ 'any.required': 'judul wajib diisi.', 'string.empty': 'judul tidak boleh kosong.' }),
  deskripsi             : Joi.string().required().messages({ 'any.required': 'deskripsi wajib diisi.', 'string.empty': 'deskripsi tidak boleh kosong.' }),
  lokasi                : Joi.string().required().messages({ 'any.required': 'lokasi wajib diisi.', 'string.empty': 'lokasi tidak boleh kosong.' }),
  keahlian_dibutuhkan   : Joi.string().required().messages({ 'any.required': 'keahlian_dibutuhkan wajib diisi.', 'string.empty': 'keahlian_dibutuhkan tidak boleh kosong.' }),
  pendidikan_dibutuhkan : Joi.string().required().messages({ 'any.required': 'pendidikan_dibutuhkan wajib diisi.', 'string.empty': 'pendidikan_dibutuhkan tidak boleh kosong.' }),
  pengalaman_dibutuhkan : Joi.number().required().messages({ 'any.required': 'pengalaman_dibutuhkan wajib diisi.', 'number.base': 'pengalaman_dibutuhkan harus berupa angka.' }),
});

const skemaStatusLowongan = Joi.object({
  status: Joi.string().valid('buka', 'tutup').required().messages({
    'any.required': 'status wajib diisi.',
    'any.only'    : 'status hanya boleh "buka" atau "tutup".',
  }),
});

const lihatSemuaLowongan = async (req, res, next) => {
  try {
    const lowongan = await modelLowongan.ambilSemua();
    res.json({ message: 'Semua lowongan kerja berhasil diambil.', data: lowongan });
  } catch (err) { next(err); }
};

const lihatLowonganById = async (req, res, next) => {
  try {
    const lowongan = await modelLowongan.ambilBerdasarkanId(req.params.id);
    if (!lowongan) return res.status(404).json({ message: 'Lowongan tidak ditemukan.' });
    res.json({ message: 'Lowongan berhasil diambil.', data: lowongan });
  } catch (err) { next(err); }
};

const lihatLowonganSayaPerusahaan = async (req, res, next) => {
  try {
    const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profil) return res.status(404).json({ message: 'Profil perusahaan tidak ditemukan.' });
    const lowongan = await modelLowongan.ambilBerdasarkanIdPerusahaan(profil.id);
    res.json({ message: 'Lowongan perusahaan berhasil diambil.', data: lowongan });
  } catch (err) { next(err); }
};

const buatLowongan = async (req, res, next) => {
  try {
    let profil;
    if (req.authUser.role === 'perusahaan') {
      profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      if (!profil) return res.status(400).json({ message: 'Buat profil perusahaan terlebih dahulu.' });
    } else {
      const idPerusahaan = parseInt(req.body.id_perusahaan, 10);
      if (!idPerusahaan) return res.status(400).json({ message: 'id_perusahaan wajib diisi untuk recruiter/admin.' });
      profil = await modelPerusahaan.ambilBerdasarkanId(idPerusahaan);
      if (!profil) return res.status(404).json({ message: 'Profil perusahaan tidak ditemukan.' });
    }

    const { error, value } = skemaLowongan.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { id_kategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan } = value;

    const id = await modelLowongan.buat({
      idPerusahaan: profil.id,
      idKategori: id_kategori,
      judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan
    });

    const lowongan = await modelLowongan.ambilBerdasarkanId(id);
    res.status(201).json({ message: 'Lowongan kerja berhasil dibuat.', data: lowongan });
  } catch (err) { next(err); }
};

const perbaruiLowongan = async (req, res, next) => {
  try {
    const lowongan = await modelLowongan.ambilBerdasarkanId(req.params.id);
    if (!lowongan) return res.status(404).json({ message: 'Lowongan tidak ditemukan.' });

    if (req.authUser.role !== 'admin' && req.authUser.role !== 'recruiter') {
      const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      if (!profil || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });
      }
    }

    const { error, value } = skemaLowongan.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { id_kategori, judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan } = value;

    await modelLowongan.perbarui(req.params.id, {
      idKategori: id_kategori,
      judul, deskripsi, lokasi, keahlian_dibutuhkan, pendidikan_dibutuhkan, pengalaman_dibutuhkan
    });

    const updated = await modelLowongan.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Lowongan kerja berhasil diupdate.', data: updated });
  } catch (err) { next(err); }
};

const perbaruiStatusLowongan = async (req, res, next) => {
  try {
    const { error, value } = skemaStatusLowongan.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { status } = value;

    const lowongan = await modelLowongan.ambilBerdasarkanId(req.params.id);
    if (!lowongan) return res.status(404).json({ message: 'Lowongan tidak ditemukan.' });

    if (req.authUser.role !== 'admin' && req.authUser.role !== 'recruiter') {
      const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      if (!profil || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });
      }
    }

    await modelLowongan.perbaruiStatus(req.params.id, status);
    const updated = await modelLowongan.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Status lowongan berhasil diupdate.', data: updated });
  } catch (err) { next(err); }
};

const hapusLowongan = async (req, res, next) => {
  try {
    const lowongan = await modelLowongan.ambilBerdasarkanId(req.params.id);
    if (!lowongan) return res.status(404).json({ message: 'Lowongan tidak ditemukan.' });

    if (req.authUser.role !== 'admin' && req.authUser.role !== 'recruiter') {
      const profil = await modelPerusahaan.ambilBerdasarkanIdPengguna(req.authUser.id);
      if (!profil || lowongan.id_perusahaan !== profil.id) {
        return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });
      }
    }

    await modelLowongan.hapus(req.params.id);
    res.json({ message: 'Lowongan kerja berhasil dihapus.', data: null });
  } catch (err) { next(err); }
};

module.exports = { lihatSemuaLowongan, lihatLowonganById, lihatLowonganSayaPerusahaan, buatLowongan, perbaruiLowongan, perbaruiStatusLowongan, hapusLowongan };
