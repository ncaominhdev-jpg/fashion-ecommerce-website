const AddressModel = require("../models/addressModel");

const getUserId = (req) => req.body.user_id || req.params.user_id || req.user?.id;

class AddressController {
  static async getMine(req, res) {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({ message: "Vui lòng đăng nhập để xem địa chỉ" });
      }

      const addresses = await AddressModel.findAll({
        where: { user_id },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Lấy danh sách địa chỉ thành công",
        data: addresses,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách địa chỉ", error: error.message });
    }
  }

  static async getByUser(req, res) {
    try {
      const user_id = getUserId(req);

      if (!user_id) {
        return res.status(400).json({ message: "Thiếu thông tin người dùng" });
      }

      const addresses = await AddressModel.findAll({
        where: { user_id },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Lấy danh sách địa chỉ thành công",
        data: addresses,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách địa chỉ", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const address = await AddressModel.findByPk(id);

      if (!address) {
        return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
      }

      res.status(200).json({ data: address });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy địa chỉ", error: error.message });
    }
  }

  static async add(req, res) {
    try {
      const user_id = getUserId(req);
      const { recipient_name, phone, address, note } = req.body;

      if (!user_id) {
        return res.status(401).json({ message: "Vui lòng đăng nhập để lưu địa chỉ" });
      }

      if (!recipient_name || !phone || !address) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ" });
      }

      const newAddress = await AddressModel.create({
        user_id,
        recipient_name,
        phone,
        address,
        note,
      });

      res.status(201).json({
        message: "Thêm địa chỉ thành công",
        address: newAddress,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể thêm địa chỉ", error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const item = await AddressModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
      }

      await item.update(req.body);
      res.status(200).json({
        message: "Cập nhật địa chỉ thành công",
        address: item,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể cập nhật địa chỉ", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await AddressModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
      }

      await item.destroy();
      res.status(200).json({ message: "Xóa địa chỉ thành công" });
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa địa chỉ", error: error.message });
    }
  }
}

module.exports = AddressController;
