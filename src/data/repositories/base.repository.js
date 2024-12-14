const prisma = require('../../lib/prisma');

class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Model name is required');
    }
    this.model = model;
  }

  async create(data) {
    return await prisma[this.model].create({
      data
    });
  }

  async findById(id) {
    return await prisma[this.model].findUnique({
      where: { id }
    });
  }

  async findOne(conditions) {
    return await prisma[this.model].findFirst({
      where: conditions
    });
  }

  async find(conditions = {}, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma[this.model].findMany({
      where: conditions,
      skip,
      take,
      orderBy
    });
  }

  async update(id, data) {
    return await prisma[this.model].update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await prisma[this.model].delete({
      where: { id }
    });
  }

  async count(conditions = {}) {
    return await prisma[this.model].count({
      where: conditions
    });
  }
}

module.exports = BaseRepository; 