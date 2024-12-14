const jwt = require('jsonwebtoken');
const userRepository = require('../data/repositories/user.repository');
const { AppError } = require('../middleware/error.middleware');
const { CreateUserDto } = require('../dtos/user.dto');

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  async register(userData) {
    const userExists = await userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new AppError(400, 'User already exists');
    }

    const createUserDto = new CreateUserDto(userData);
    const user = await userRepository.create(createUserDto);
    const { password: _, ...userResponse } = user;

    return {
      ...userResponse,
      token: this.generateToken(user.id),
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await userRepository.matchPassword(user.password, password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const { password: _, ...userResponse } = user;
    return {
      ...userResponse,
      token: this.generateToken(user.id),
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }
}

module.exports = new AuthService(); 