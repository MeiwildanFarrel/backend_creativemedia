const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, dan password wajib diisi.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter.' });
    }

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah digunakan.' });
    }

    // Menggunakan bcrypt untuk hash password
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

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