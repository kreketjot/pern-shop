const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../errors/ApiError');

class DeviceController {
  static async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      const fileName = `${uuid.v4()}.jpg`;
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        const infoObj = JSON.parse(info) || [];

        infoObj.forEach((i) => DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        }));
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  static async getAll(req, res, limit_, page_) {
    const { brandId, typeId } = req.body;
    const limit = limit_ || 9;
    const page = page_ || 1;
    const offset = (page - 1) * limit;
    let devices;
    if (!brandId && !typeId) {
      devices = Device.findAndCountAll({ limit, offset });
    } else if (brandId && !typeId) {
      devices = Device.findAndCountAll({ where: brandId, limit, offset });
    } else if (!brandId && typeId) {
      devices = Device.findAndCountAll({ where: typeId, limit, offset });
    } else { // bnandId && typeId
      devices = Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
    }

    res.json(devices);
  }

  static async getOne(req, res) {
    const { id } = req.params;
    const device = Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    });

    return res.json(device);
  }
}

module.exports = DeviceController;
