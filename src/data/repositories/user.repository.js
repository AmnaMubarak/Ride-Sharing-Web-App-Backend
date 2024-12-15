const BaseRepository = require('./base.repository');
const { CreateUserDto, UserResponseDto } = require('../../dtos/user.dto');
const bcrypt = require('bcryptjs');
const ValidationError = require('../../middleware/error.middleware');

class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async create(createUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    
    const user = await super.create({
      ...createUserDto.toJSON(),
      password: hashedPassword
    });
    
    return new UserResponseDto(user);
  }

  async findByEmail(email) {
    const user = await super.findOne({ email });
    if (!user) return null;

    const userWithPassword = { ...user };
    const userDto = new UserResponseDto(user);
    return { ...userDto, password: userWithPassword.password };
  }

  async findById(id) {
    const user = await super.findById(id);
    return user ? new UserResponseDto(user) : null;
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 14);
  }

  async matchPassword(hashedPassword, enteredPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) throw new ValidationError('Password must be at least 8 characters');
    if (!hasUpperCase) throw new ValidationError('Password must contain uppercase letters');
    if (!hasLowerCase) throw new ValidationError('Password must contain lowercase letters');
    if (!hasNumbers) throw new ValidationError('Password must contain numbers');
    if (!hasSpecialChar) throw new ValidationError('Password must contain special characters');
  }
}

module.exports = new UserRepository(); 