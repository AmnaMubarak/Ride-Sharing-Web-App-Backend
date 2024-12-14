const jwt = require('jsonwebtoken');
const userRepository = require('../data/repositories/user.repository');
const { AppError } = require('./error.middleware');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer')) {
      throw new AppError(401, 'Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
}; 