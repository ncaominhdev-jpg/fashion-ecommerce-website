const VariantModel = require('../models/productVariantsModel');
const SizeModel = require('../models/sizeModel');
const ColorModel = require('../models/colorModel');

class ProductVariantController {

  // Lấy tất cả biến thể
  static async get(req, res) {
    try {
      const variants = await VariantModel.findAll();
      res.status(200).json({
        message: 'Lấy danh sách biến thể thành công',
        data: variants
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy biến thể theo ID
  // Lấy biến thể theo ID (product_id)
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const variants = await VariantModel.findAll({
        where: { product_id: id },
        include: [
          {
            model: SizeModel,
            as: 'size',
            attributes: ['id', 'size_label']
          },
          {
            model: ColorModel,
            as: 'color',
            attributes: ['id', 'color_code']
          }
        ]
      });

      res.status(200).json({
        message: 'Lấy biến thể theo sản phẩm thành công',
        data: variants
      });
    } catch (error) {
      console.error('[LỖI /variant/:id]:', error);
      res.status(500).json({ error: error.message });
    }
  }


  // Lấy tất cả biến thể của 1 sản phẩm
  static async getByProduct(req, res) {
    try {
      const { id } = req.params;
      const variants = await VariantModel.findAll({ where: { product_id: id } });

      res.status(200).json({
        message: 'Lấy biến thể theo sản phẩm thành công',
        data: variants
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm biến thể mới
  static async add(req, res) {
    try {
      const { product_id, size_id, color_id, stock } = req.body;

      const newVariant = await VariantModel.create({
        product_id,
        size_id,
        color_id,
        stock
      });

      res.status(201).json({
        message: 'Tạo biến thể thành công',
        variant: newVariant
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật biến thể
  static async update(req, res) {
    try {
      const { id } = req.params;
      const variant = await VariantModel.findByPk(id);
      if (!variant) {
        return res.status(404).json({ message: 'Không tìm thấy biến thể' });
      }

      await variant.update(req.body);

      res.status(200).json({
        message: 'Cập nhật biến thể thành công',
        variant
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xoá biến thể
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const variant = await VariantModel.findByPk(id);
      if (!variant) {
        return res.status(404).json({ message: 'Không tìm thấy biến thể' });
      }

      await variant.destroy();
      res.status(200).json({ message: 'Xoá biến thể thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductVariantController;