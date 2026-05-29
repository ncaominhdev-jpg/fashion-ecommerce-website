const { Product, Category, defineAssociations } = require("../models/associate");
defineAssociations();

const normalizeOptionalNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") return fallback;
  return value;
};

class ProductController {
  static async get(req, res) {
    try {
      const products = await Product.findAll({
        include: {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      });
      res.status(200).json({
        message: "Lấy danh sách sản phẩm thành công",
        data: products,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.status(500).json({ message: "Không thể lấy danh sách sản phẩm", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      res.status(200).json({ data: product });
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo ID:", error);
      res.status(500).json({ message: "Không thể lấy sản phẩm", error: error.message });
    }
  }

  static async add(req, res) {
    try {
      const image = req.body.image || (req.file ? `/images/${req.file.filename}` : null);
      const { name, description, price, sale_price, stock, category_id, brand_id, target_group_id } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        sale_price: normalizeOptionalNumber(sale_price, 0),
        stock: normalizeOptionalNumber(stock, 0),
        category_id,
        brand_id: normalizeOptionalNumber(brand_id, 1),
        target_group_id: normalizeOptionalNumber(target_group_id, 1),
        image,
      });

      res.status(201).json({
        message: "Thêm sản phẩm thành công",
        product,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      res.status(500).json({ message: "Không thể thêm sản phẩm", error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      const updateData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        sale_price: normalizeOptionalNumber(req.body.sale_price, product.sale_price),
        stock: normalizeOptionalNumber(req.body.stock, product.stock),
        category_id: req.body.category_id,
        brand_id: normalizeOptionalNumber(req.body.brand_id, product.brand_id || 1),
        target_group_id: normalizeOptionalNumber(req.body.target_group_id, product.target_group_id || 1),
      };

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined || updateData[key] === null || updateData[key] === "") {
          delete updateData[key];
        }
      });

      if (req.body.image) {
        updateData.image = req.body.image;
      } else if (req.file) {
        updateData.image = `/images/${req.file.filename}`;
      }

      await product.update(updateData);

      res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        product,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      res.status(500).json({ message: "Không thể cập nhật sản phẩm", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      await product.destroy();
      res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa sản phẩm", error: error.message });
    }
  }

  static async getProductCount(req, res) {
    try {
      const count = await Product.count();
      res.status(200).json({ count });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng sản phẩm:", error);
      res.status(500).json({ message: "Không thể lấy số lượng sản phẩm", error: error.message });
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
          as: "category",
          attributes: ["id", "name"],
        },
      });
      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      res.status(500).json({ message: "Không thể tìm kiếm sản phẩm", error: error.message });
    }
  }
}

module.exports = ProductController;
