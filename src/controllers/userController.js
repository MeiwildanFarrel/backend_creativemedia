const userModel = require('../models/userModel');

const getProfile = async (req, res, next) => {
  try {
    // ID didapatkan dari middleware token
    const userId = req.authUser.id; 

    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.json({
      message: 'Profil berhasil diambil.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile };