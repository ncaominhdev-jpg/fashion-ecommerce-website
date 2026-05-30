const OrderDetailModel = require('../models/orderDetailModel');
const OrderModel = require('../models/orderModel');
const ProductVariantModel = require('../models/productVariantsModel');
const ProductModel = require('../models/productsModel');
const SizeModel = require('../models/sizeModel');
const ColorModel = require('../models/colorModel');

const isAdmin = (user) => user?.role === 'admin';

class OrderDetailController {
  static async get(req, res) {
    try {
      const details = await OrderDetailModel.findAll();
      res.status(200).json({
        message: 'Lấy danh sách chi tiết đơn hàng thành công',
        data: details,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      if (Number(req.user.id) !== Number(order.user_id) && !isAdmin(req.user)) {
        return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
      }

      const details = await OrderDetailModel.findAll({
        where: { order_id: id },
        include: [
          {
            model: ProductVariantModel,
            as: 'variant',
            include: [
              { model: ProductModel, as: 'product', attributes: ['id', 'name', 'image', 'price', 'sale_price'] },
              { model: SizeModel, as: 'size', attributes: ['id', 'size_label'] },
              { model: ColorModel, as: 'color', attributes: ['id', 'color_name', 'color_code'] },
            ],
          },
        ],
      });

      res.status(200).json({
        message: 'Lấy chi tiết đơn hàng thành công',
        data: details,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async add(req, res) {
    try {
      const { order_id, variant_id, quantity, price } = req.body;
      const newItem = await OrderDetailModel.create({ order_id, variant_id, quantity, price });

      res.status(201).json({
        message: 'Thêm sản phẩm vào đơn hàng thành công',
        item: newItem,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

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
        item,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await OrderDetailModel.findByPk(id);

      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy dòng chi tiết' });
      }

      await item.destroy();
      res.status(200).json({ message: 'Xóa dòng chi tiết thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderDetailController;
