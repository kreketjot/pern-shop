const { Type } = require('../models/models');
const ApiError = require('../errors/ApiError');

class TypeController {
  static async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }

  static async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }
}

module.exports = TypeController;
