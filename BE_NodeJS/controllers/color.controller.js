const ColorModel = require('../models/colorModel');

class ColorController {
    
    // Lấy danh sách tất cả màu sản phẩm
    static async get(req, res) {
        try {
            const colors = await ColorModel.findAll();
            res.status(200).json({
                status: 200,
                message: "Lấy danh sách màu sản phẩm thành công",
                data: colors
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy màu sản phẩm theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const color = await ColorModel.findByPk(id);

            if (!color) {
                return res.status(404).json({ message: "Id màu sản phẩm không tồn tại" });
            }

            res.status(200).json({
                status: 200,
                data: color
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Tạo màu sản phẩm mới
    static async create(req, res) {
        try {
            const newColor = await ColorModel.create(req.body);
            res.status(201).json({
                message: "Tạo màu sản phẩm mới thành công",
                color: newColor
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật màu sản phẩm
    static async update(req, res) {
        try {
            const { id } = req.params;
            const color = await ColorModel.findByPk(id);

            if (!color) {
                return res.status(404).json({ message: "Id màu sản phẩm không tồn tại" });
            }

            await color.update(req.body);

            res.status(200).json({
                message: "Cập nhật màu sản phẩm thành công",
                color
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xoá màu sản phẩm
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const color = await ColorModel.findByPk(id);

            if (!color) {
                return res.status(404).json({ message: "Id màu sản phẩm không tồn tại" });
            }

            await color.destroy();

            res.status(200).json({ message: "Xoá màu sản phẩm thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ColorController;
