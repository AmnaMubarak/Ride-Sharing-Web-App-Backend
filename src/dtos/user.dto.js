class CreateUserDto {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role;
  }

  toJSON() {
    return {
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role,
    };
  }
}

class UserResponseDto {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

module.exports = {
  CreateUserDto,
  UserResponseDto,
}; 