const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.authUser || !req.authUser.role) {
      return res.status(403).json({ message: 'Akses ditolak. Role tidak dikenali.' });
    }

    const userRole = req.authUser.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Akses ditolak. Role Anda tidak diizinkan.' });
    }

    next();
  };
};

module.exports = authorizeRole;