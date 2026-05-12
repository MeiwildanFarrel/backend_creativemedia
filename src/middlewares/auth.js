const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token JWT tidak ditemukan.' });
  }

  const token = authHeader.slice(7);

  try {
    if (!process.env.JWT_SECRET) {
        throw new Error("FATAL ERROR: JWT_SECRET tidak ada di .env");
    }

    // Verify token dengan JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Tempelkan data user ke request
    req.authUser = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token JWT tidak valid atau kedaluwarsa.' });
  }
}

module.exports = authenticateToken;