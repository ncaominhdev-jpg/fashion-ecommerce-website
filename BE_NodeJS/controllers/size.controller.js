const SizeModel = require('../models/sizeModel');

class SizeController {
    
    // Lấy danh sách tất cả size sản phẩm
    static async get(req, res) {
        try {
            const sizes = await SizeModel.findAll();
            res.status(200).json({
                status: 200,
                message: "Lấy danh sách size sản phẩm thành công",
                data: sizes
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy size sản phẩm theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const size = await SizeModel.findByPk(id);

            if (!size) {
                return res.status(404).json({ message: "Id size sản phẩm không tồn tại" });
            }

            res.status(200).json({
                status: 200,
                data: size
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Tạo size sản phẩm mới
    static async create(req, res) {
        try {
            const newSize = await SizeModel.create(req.body);
            res.status(201).json({
                message: "Tạo size sản phẩm mới thành công",
                size: newSize
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật size sản phẩm
    static async update(req, res) {
        try {
            const { id } = req.params;
            const size = await SizeModel.findByPk(id);

            if (!size) {
                return res.status(404).json({ message: "Id size sản phẩm không tồn tại" });
            }

            await size.update(req.body);

            res.status(200).json({
                message: "Cập nhật size sản phẩm thành công",
                size
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xoá size sản phẩm
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const size = await SizeModel.findByPk(id);

            if (!size) {
                return res.status(404).json({ message: "Id size sản phẩm không tồn tại" });
            }

            await size.destroy();

            res.status(200).json({ message: "Xoá size sản phẩm thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SizeController;
