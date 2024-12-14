const BaseRepository = require('./base.repository');
const { CreateUserDto, UserResponseDto } = require('../../dtos/user.dto');
const bcrypt = require('bcryptjs');

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
    return await bcrypt.hash(password, 12);
  }

  async matchPassword(hashedPassword, enteredPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = new UserRepository(); 