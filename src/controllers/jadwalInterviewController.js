const Joi = require('joi');
const modelJadwal     = require('../models/jadwalInterviewModel');
const modelLamaran    = require('../models/lamaranKerjaModel');
const modelLowongan   = require('../models/lowonganKerjaModel');
const modelPerusahaan = require('../models/profilPerusahaanModel');
const modelPelamar    = require('../models/profilPelamarModel');

const skemaJadwal = Joi.object({
  jadwal  : Joi.string().isoDate().required().messages({ 'any.required': 'jadwal wajib diisi.', 'string.isoDate': 'jadwal harus berupa format tanggal ISO 8601.' }),
  lokasi  : Joi.string().required().messages({ 'any.required': 'lokasi wajib diisi.', 'string.empty': 'lokasi tidak boleh kosong.' }),
  catatan : Joi.string().optional().allow('', null),
});

const STATUS_JADWAL_VALID = ['terjadwal', 'selesai', 'dibatalkan'];

// cek akses baca: pelamar pemilik, perusahaan pemilik lowongan, recruiter, admin
const cekAksesLamaran = async (lamaran, authUser) => {
  const { role, id: idPengguna } = authUser;
  if (role === 'admin' || role === 'recruiter') return null;
  if (role === 'pelamar') {
    const profil = await modelPelamar.ambilBerdasarkanIdPengguna(idPengguna);
    if (!profil || lamaran.id_pelamar !== profil.id) return 'forbidden';
  } else if (role === 'perusahaan') {
    const profil   = await modelPerusahaan.ambilBerdasarkanIdPengguna(idPengguna);
    const lowongan = await modelLowongan.ambilBerdasarkanId(lamaran.id_lowongan);
    if (!profil || !lowongan || lowongan.id_perusahaan !== profil.id) return 'forbidden';
  }
  return null;
};

// cek kepemilikan manajemen: perusahaan pemilik lowongan, recruiter, admin
const cekKepemilikanDariLamaran = async (lamaran, authUser) => {
  const { role, id: idPengguna } = authUser;
  if (role === 'admin' || role === 'recruiter') return null;
  if (role === 'perusahaan') {
    const profil   = await modelPerusahaan.ambilBerdasarkanIdPengguna(idPengguna);
    const lowongan = await modelLowongan.ambilBerdasarkanId(lamaran.id_lowongan);
    if (!profil || !lowongan || lowongan.id_perusahaan !== profil.id) return 'forbidden';
  }
  return null;
};

const lihatJadwalPerLamaran = async (req, res, next) => {
  try {
    const lamaran = await modelLamaran.ambilBerdasarkanId(req.params.id_lamaran);
    if (!lamaran) return res.status(404).json({ message: 'Lamaran tidak ditemukan.' });

    const aksesError = await cekAksesLamaran(lamaran, req.authUser);
    if (aksesError) return res.status(403).json({ message: 'Akses ditolak.' });

    const jadwal = await modelJadwal.ambilBerdasarkanIdLamaran(req.params.id_lamaran);
    res.json({ message: 'Jadwal interview berhasil diambil.', data: jadwal });
  } catch (err) { next(err); }
};

const lihatJadwalSaya = async (req, res, next) => {
  try {
    const profil = await modelPelamar.ambilBerdasarkanIdPengguna(req.authUser.id);
    if (!profil) return res.status(404).json({ message: 'Profil pelamar tidak ditemukan.' });
    const jadwal = await modelJadwal.ambilJadwalSayaPelamar(profil.id);
    res.json({ message: 'Jadwal interview berhasil diambil.', data: jadwal });
  } catch (err) { next(err); }
};

const lihatJadwalById = async (req, res, next) => {
  try {
    const jadwal = await modelJadwal.ambilBerdasarkanId(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });

    const lamaran    = await modelLamaran.ambilBerdasarkanId(jadwal.id_lamaran);
    const aksesError = await cekAksesLamaran(lamaran, req.authUser);
    if (aksesError) return res.status(403).json({ message: 'Akses ditolak.' });

    res.json({ message: 'Detail jadwal berhasil diambil.', data: jadwal });
  } catch (err) { next(err); }
};

const buatJadwal = async (req, res, next) => {
  try {
    const { id_lamaran } = req.body;

    const lamaran = await modelLamaran.ambilBerdasarkanId(id_lamaran);
    if (!lamaran) return res.status(404).json({ message: 'Lamaran tidak ditemukan.' });

    if (lamaran.status !== 'interview') {
      return res.status(400).json({ message: 'Status lamaran harus interview sebelum menjadwalkan interview.' });
    }

    const aksesError = await cekKepemilikanDariLamaran(lamaran, req.authUser);
    if (aksesError) return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });

    const { error, value } = skemaJadwal.validate(req.body, { abortEarly: true, allowUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const id = await modelJadwal.buat({
      idLamaran: id_lamaran,
      jadwal   : value.jadwal,
      lokasi   : value.lokasi,
      catatan  : value.catatan || null
    });

    const jadwalBaru = await modelJadwal.ambilBerdasarkanId(id);
    res.status(201).json({ message: 'Jadwal interview berhasil dibuat.', data: jadwalBaru });
  } catch (err) { next(err); }
};

const perbaruiJadwal = async (req, res, next) => {
  try {
    const jadwal = await modelJadwal.ambilBerdasarkanId(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });

    const lamaran    = await modelLamaran.ambilBerdasarkanId(jadwal.id_lamaran);
    const aksesError = await cekKepemilikanDariLamaran(lamaran, req.authUser);
    if (aksesError) return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });

    const { error, value } = skemaJadwal.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    await modelJadwal.perbarui(req.params.id, {
      jadwal : value.jadwal,
      lokasi : value.lokasi,
      catatan: value.catatan || null
    });

    const updated = await modelJadwal.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Jadwal interview berhasil diupdate.', data: updated });
  } catch (err) { next(err); }
};

const perbaruiStatusJadwal = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUS_JADWAL_VALID.includes(status)) {
      return res.status(400).json({ message: `Status hanya boleh: ${STATUS_JADWAL_VALID.join(', ')}.` });
    }

    const jadwal = await modelJadwal.ambilBerdasarkanId(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });

    const lamaran    = await modelLamaran.ambilBerdasarkanId(jadwal.id_lamaran);
    const aksesError = await cekKepemilikanDariLamaran(lamaran, req.authUser);
    if (aksesError) return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });

    await modelJadwal.perbaruiStatus(req.params.id, status);
    const updated = await modelJadwal.ambilBerdasarkanId(req.params.id);
    res.json({ message: 'Status jadwal berhasil diupdate.', data: updated });
  } catch (err) { next(err); }
};

const hapusJadwal = async (req, res, next) => {
  try {
    const jadwal = await modelJadwal.ambilBerdasarkanId(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });

    const lamaran    = await modelLamaran.ambilBerdasarkanId(jadwal.id_lamaran);
    const aksesError = await cekKepemilikanDariLamaran(lamaran, req.authUser);
    if (aksesError) return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik lowongan ini.' });

    await modelJadwal.hapus(req.params.id);
    res.json({ message: 'Jadwal interview berhasil dihapus.', data: null });
  } catch (err) { next(err); }
};

module.exports = { lihatJadwalPerLamaran, lihatJadwalSaya, lihatJadwalById, buatJadwal, perbaruiJadwal, perbaruiStatusJadwal, hapusJadwal };
