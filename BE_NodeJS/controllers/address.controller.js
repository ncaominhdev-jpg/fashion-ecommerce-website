const AddressModel = require('../models/addressModel');

class AddressController {

  // Lấy tất cả địa chỉ của user
  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      const addresses = await AddressModel.findAll({ where: { user_id } });

      res.status(200).json({
        message: 'Lấy danh sách địa chỉ thành công',
        data: addresses
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy 1 địa chỉ theo id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const address = await AddressModel.findByPk(id);

      if (!address) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
      }

      res.status(200).json({ data: address });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm địa chỉ mới
  static async add(req, res) {
    try {
      const { user_id, recipient_name, phone, address, note } = req.body;

      const newAddress = await AddressModel.create({
        user_id,
        recipient_name,
        phone,
        address,
        note
      });

      res.status(201).json({
        message: 'Thêm địa chỉ thành công',
        address: newAddress
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật địa chỉ
  static async update(req, res) {
    try {
      const { id } = req.params;
      const item = await AddressModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
      }

      await item.update(req.body);
      res.status(200).json({
        message: 'Cập nhật địa chỉ thành công',
        address: item
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xóa địa chỉ
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await AddressModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
      }

      await item.destroy();
      res.status(200).json({ message: 'Xoá địa chỉ thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AddressController;
