const { Product, Category, defineAssociations } = require('../models/associate');
defineAssociations();

class ProductController {

  // Lấy tất cả sản phẩm
  static async get(req, res) {
    try {
      const products = await Product.findAll({
        include: {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      });
      res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm: ", error); 
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy sản phẩm theo ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        console.log(`Không tìm thấy sản phẩm với ID ${id}`);
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }
      

      res.status(200).json({ data: product });
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo ID:", error); // Log thêm chi tiết lỗi
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm sản phẩm mới
  static async add(req, res) {
    try {
      const image = req.file ? `/images/${req.file.filename}` : null;
  
      const { name, description, price, sale_price, stock, category_id, brand_id, target_group_id } = req.body;
  
      const product = await Product.create({
        name,
        description,
        price,
        sale_price,
        stock,
        category_id,
        brand_id,
        target_group_id,
        image,
      });
  
      res.status(201).json({
        message: 'Thêm sản phẩm thành công',
        product
      });
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm:", error);  
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật sản phẩm
  static async update(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      const image = req.file ? `/images/${req.file.filename}` : product.image;

      await product.update({
        ...req.body,
        image
      });

      res.status(200).json({
        message: 'Cập nhật sản phẩm thành công',
        product
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xóa sản phẩm
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      await product.destroy();
      res.status(200).json({ message: 'Xoá sản phẩm thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getProductCount(req, res) {
    try {
      const count = await Product.count();
      res.status(200).json({ count });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng sản phẩm:", error);
      res.status(500).json({ error: error.message });
    }
  }
  static async search(req, res) {
    const { searchTerm } = req.query;
    try {
      const products = await Product.findAll({
        where: {
          name: {
            [require("sequelize").Op.like]: `%${searchTerm}%`,
          },
        },
        include: {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      });
      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      res.status(500).json({ error: error.message });
    }
  }
  
};




module.exports = ProductController;
