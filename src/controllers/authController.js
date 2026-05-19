const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userModel = require('../models/userModel');

const skemaRegister = Joi.object({
  name    : Joi.string().required().messages({ 'any.required': 'name wajib diisi.', 'string.empty': 'name tidak boleh kosong.' }),
  email   : Joi.string().email().required().messages({ 'any.required': 'email wajib diisi.', 'string.email': 'email harus berupa alamat email yang valid.' }),
  password: Joi.string().min(8).required().messages({ 'any.required': 'password wajib diisi.', 'string.min': 'password minimal 8 karakter.' }),
  role    : Joi.string().valid('pelamar', 'perusahaan', 'recruiter').optional().default('pelamar').messages({ 'any.only': 'role hanya boleh: pelamar, perusahaan, recruiter.' }),
});

const skemaLogin = Joi.object({
  email   : Joi.string().email().required().messages({ 'any.required': 'email wajib diisi.', 'string.email': 'email harus berupa alamat email yang valid.' }),
  password: Joi.string().required().messages({ 'any.required': 'password wajib diisi.', 'string.empty': 'password tidak boleh kosong.' }),
});

const register = async (req, res, next) => {
  try {
    const { error, value } = skemaRegister.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role } = value;

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah digunakan.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const insertId = await userModel.createUser(name, email, passwordHash, role);
    const newUser = await userModel.getUserById(insertId);

    res.status(201).json({
      message: 'User berhasil didaftarkan.',
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = skemaLogin.validate(req.body, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Menggunakan bcrypt untuk verifikasi password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("FATAL ERROR: JWT_SECRET tidak ada di .env");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Menggunakan jsonwebtoken standar
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN_SECONDS ? parseInt(process.env.JWT_EXPIRES_IN_SECONDS) : 3600
    });

    res.json({
      message: 'Login berhasil.',
      data: {
        token,
        token_type: 'Bearer',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };