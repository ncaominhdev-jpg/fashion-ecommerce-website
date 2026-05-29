const Order = require ('../models/orderModel')
const User = require ('../models/usersModel')
const Address = require ('../models/addressModel')


class OrderController {
  // Lấy danh sách đơn hàng
  static async get(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: 'userOrder', // Alias đúng
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Address,
            as: 'orderAddress', // Alias đúng
            attributes: ['id', 'address', 'phone', 'recipient_name'], // Thêm các cột cần thiết từ Address
          },
        ],
      });

      res.status(200).json({
        message: 'Lấy danh sách đơn hàng thành công',
        data: orders,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy đơn hàng theo ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'userOrder',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Address,
            as: 'orderAddress',
            attributes: ['id', 'address', 'phone', 'recipient_name'], // Thêm các cột cần thiết từ Address
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      res.status(200).json({ data: order });
    } catch (error) {
      console.error("Lỗi lấy đơn hàng theo ID:", error);
      res.status(500).json({ error: error.message });
    }
  }
  

  // Lấy đơn hàng của người dùng
  static async getByUser(req, res) {
    const { user_id } = req.params;
  
    if (parseInt(user_id) !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập đơn hàng này.' });
    }
  
    try {
      const orders = await Order.findAll({
        where: { user_id },
        include: [
          {
            model: Address,
            as: 'orderAddress',
            attributes: ['id', 'address', 'phone'],
          },
        ],
      });
  
      res.status(200).json({ message: 'Lấy đơn hàng của bạn thành công', data: orders });
    } catch (error) {
      console.error("Lỗi lấy đơn hàng của người dùng:", error);
      res.status(500).json({ error: error.message });
    }
  }
  

  // Tạo đơn hàng mới
  static async create(req, res) {
    try {
      const { user_id, address_id, order_date, status, note } = req.body;

      const newOrder = await Order.create({
        user_id,
        address_id,
        order_date,
        status,
        note,
      });

      res.status(201).json({
        message: 'Tạo đơn hàng thành công',
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật đơn hàng
  static async update(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      await order.update(req.body);
      res.status(200).json({
        message: 'Cập nhật đơn hàng thành công',
        order,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xoá đơn hàng
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      await order.destroy();
      res.status(200).json({ message: 'Xoá đơn hàng thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getOrderCount(req, res) {
    try {
      const count = await Order.count(); // Đếm số lượng đơn hàng
      res.status(200).json({ count });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng đơn hàng:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
