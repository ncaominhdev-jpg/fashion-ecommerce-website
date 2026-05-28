const CategoryModel = require('../models/categoryModel');

class CategoryController {

    // Lấy danh sách tất cả danh mục
    static async get(req, res) {
        try {
            const categorys = await CategoryModel.findAll();
            res.status(200).json({
                status: 200,
                message: "Lấy danh sách danh mục thành công",
                data: categorys
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy danh mục theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Id danh mục không tồn tại" });
            }

            res.status(200).json({
                status: 200,
                data: category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Tạo danh mục mới// Tạo danh mục mới
    static async create(req, res) {
        try {
          const { name, status } = req.body;
      
          const newCategory = await CategoryModel.create({
            name,
            status: status === 'inactive' ? 'inactive' : 'active', 
          });
      
          res.status(201).json({
            message: "Tạo danh mục mới thành công",
            category: newCategory,
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }


    // Cập nhật danh mục
    static async update(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Id danh mục không tồn tại" });
            }

            await category.update(req.body);

            res.status(200).json({
                message: "Cập nhật danh mục thành công",
                category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xoá danh mục
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Id danh mục không tồn tại" });
            }

            await category.destroy();

            res.status(200).json({ message: "Xoá danh mục thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async search(req, res) {
        try {
            const { searchTerm } = req.query; // Lấy từ khóa tìm kiếm từ query string
    
            // Kiểm tra nếu không có từ khóa tìm kiếm
            if (!searchTerm) {
                return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
            }
    
            // Tìm danh mục có tên chứa từ khóa tìm kiếm (case-insensitive)
            const categories = await CategoryModel.findAll({
                where: {
                    name: {
                        [Sequelize.Op.like]: `%${searchTerm}%`, // Tìm kiếm tên chứa từ khóa
                    },
                },
            });
    
            if (categories.length === 0) {
                return res.status(404).json({ message: "Không có danh mục nào phù hợp" });
            }
    
            res.status(200).json({
                status: 200,
                message: "Tìm kiếm danh mục thành công",
                data: categories,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getActiveCategories(req, res) {
        try {
            const activeCategories = await CategoryModel.findAll({
                where: {
                    status: 'active', // Lọc các danh mục có trạng thái 'active'
                },
            });

            res.status(200).json({
                status: 200,
                message: "Lấy danh sách danh mục hoạt động thành công",
                data: activeCategories,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CategoryController;
