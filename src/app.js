require('dotenv').config();

//import modul
const express = require('express');
const db = require('./config/database');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const profilPelamarRoutes    = require('./routes/profilPelamar');
const profilPerusahaanRoutes = require('./routes/profilPerusahaan');
const kategoriPekerjaanRoutes = require('./routes/kategoriPekerjaan');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Creativemedia Backend API',
    endpoints: {
      register: 'POST /register',
      login: 'POST /login',
      profile: 'GET /profile'
    }
  });
});

app.get('/koneksi', async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    res.json({ message: 'Koneksi database normal.' });
  } catch (error) {
    next(error);
  }
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Daftarkan Routes
app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/profil-pelamar', profilPelamarRoutes);
app.use('/profil-perusahaan', profilPerusahaanRoutes);
app.use('/kategori-pekerjaan', kategoriPekerjaanRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
});

app.listen(port, () => {
  console.log(`Server Creativemedia berjalan di http://localhost:${port}`);
});