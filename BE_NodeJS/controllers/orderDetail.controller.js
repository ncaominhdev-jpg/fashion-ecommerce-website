const OrderDetailModel = require('../models/orderDetailModel');

class OrderDetailController {

  // Lấy tất cả chi tiết đơn hàng
  static async get(req, res) {
    try {
      const details = await OrderDetailModel.findAll();
      res.status(200).json({
        message: 'Lấy danh sách chi tiết đơn hàng thành công',
        data: details
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy danh sách chi tiết đơn hàng theo order_id (chỉ admin hoặc chủ đơn hàng được phép)
  static async getByOrder(req, res) {
    try {
      const { id } = req.params; // id = order_id

      // Lấy thông tin đơn hàng để kiểm tra chủ sở hữu
      const order = await OrderModel.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      // Kiểm tra quyền: chỉ chủ đơn hoặc admin mới được xem
      if (req.user.id !== order.user_id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
      }

      const details = await OrderDetailModel.findAll({ where: { order_id: id } });

      res.status(200).json({
        message: 'Lấy chi tiết đơn hàng thành công',
        data: details
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm sản phẩm vào đơn hàng
  static async add(req, res) {
    try {
      const { order_id, variant_id, quantity, price } = req.body;

      const newItem = await OrderDetailModel.create({
        order_id,
        variant_id,
        quantity,
        price
      });

      res.status(201).json({
        message: 'Thêm sản phẩm vào đơn hàng thành công',
        item: newItem
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật sản phẩm trong đơn hàng
  static async update(req, res) {
    try {
      const { id } = req.params;
      const item = await OrderDetailModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy dòng chi tiết' });
      }

      await item.update(req.body);
      res.status(200).json({
        message: 'Cập nhật chi tiết đơn hàng thành công',
        item
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xoá dòng sản phẩm trong đơn hàng
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await OrderDetailModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy dòng chi tiết' });
      }

      await item.destroy();
      res.status(200).json({ message: 'Xoá dòng chi tiết thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderDetailController;
