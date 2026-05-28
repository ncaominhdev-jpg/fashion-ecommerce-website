const CartModel = require('../models/cartModel');

class CartController {

  // Lấy giỏ hàng theo user_id
  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      const cartItems = await CartModel.findAll({ where: { user_id } });

      res.status(200).json({
        message: 'Lấy giỏ hàng thành công',
        data: cartItems
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm sản phẩm vào giỏ
  static async add(req, res) {
    try {
      const { user_id, variant_id, quantity } = req.body;

      // Kiểm tra nếu sản phẩm đã có trong giỏ => cập nhật số lượng
      const existingItem = await CartModel.findOne({
        where: { user_id, variant_id }
      });

      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();

        return res.status(200).json({
          message: 'Cập nhật số lượng giỏ hàng thành công',
          item: existingItem
        });
      }

      // Nếu chưa có, thêm mới
      const newItem = await CartModel.create({ user_id, variant_id, quantity });

      res.status(201).json({
        message: 'Thêm sản phẩm vào giỏ hàng thành công',
        item: newItem
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật số lượng trong giỏ hàng
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const item = await CartModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy mục trong giỏ' });
      }

      item.quantity = quantity;
      await item.save();

      res.status(200).json({
        message: 'Cập nhật số lượng thành công',
        item
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xoá sản phẩm khỏi giỏ hàng
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await CartModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy mục trong giỏ' });
      }

      await item.destroy();
      res.status(200).json({ message: 'Xoá sản phẩm khỏi giỏ hàng thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;
