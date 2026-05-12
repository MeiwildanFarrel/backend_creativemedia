const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folderUpload = path.join(__dirname, '../../uploads');
if (!fs.existsSync(folderUpload)) {
  fs.mkdirSync(folderUpload, { recursive: true });
}

// Atur cara file disimpan
const penyimpanan = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folderUpload),
  filename: (req, file, cb) => {
    const unik = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ekstensi = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${req.authUser.id}-${unik}${ekstensi}`);
  }
});

// Filter untuk CV: hanya PDF dan Word
const filterCV = (req, file, cb) => {
  const tipeIzin = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (tipeIzin.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF atau Word (.doc/.docx) yang diizinkan.'), false);
  }
};

// Filter untuk logo: hanya gambar
const filterGambar = (req, file, cb) => {
  const tipeIzin = ['image/jpeg', 'image/png'];
  if (tipeIzin.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPG atau PNG yang diizinkan.'), false);
  }
};

// Dua instance multer dengan filter berbeda
const uploadCV     = multer({ storage: penyimpanan, fileFilter: filterCV,     limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGambar = multer({ storage: penyimpanan, fileFilter: filterGambar, limits: { fileSize: 2 * 1024 * 1024 } });

module.exports = { uploadCV, uploadGambar };