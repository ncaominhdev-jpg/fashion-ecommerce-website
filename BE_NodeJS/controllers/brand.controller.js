const BrandModel = require('../models/brandsModel');

class BrandController {

    // Lấy danh sách tất cả thương hiệu
    static async get(req, res) {
        try {
            const brands = await BrandModel.findAll();
            res.status(200).json({
                status: 200,
                message: "Lấy danh sách thương hiệu thành công",
                data: brands
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy thương hiệu theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const brand = await BrandModel.findByPk(id);

            if (!brand) {
                return res.status(404).json({ message: "Id thương hiệu không tồn tại" });
            }

            res.status(200).json({
                status: 200,
                data: brand
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Tạo thương hiệu mới (kèm logo)
    static async create(req, res) {
        try {
            const { name } = req.body;
            const logo = req.file ? `/images/${req.file.filename}` : null;

            const newBrand = await BrandModel.create({ name, logo });

            res.status(201).json({
                message: "Tạo thương hiệu mới thành công",
                brand: newBrand
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật thương hiệu
    static async update(req, res) {
        try {
            const { id } = req.params;
            const brand = await BrandModel.findByPk(id);
            if (!brand) {
                return res.status(404).json({ message: "Id thương hiệu không tồn tại" });
            }

            const { name } = req.body;
            const logo = req.file ? `/images/${req.file.filename}` : brand.logo;

            brand.name = name || brand.name;
            brand.logo = logo;

            await brand.save();

            res.status(200).json({
                message: "Cập nhật thương hiệu thành công",
                brand
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xoá thương hiệu
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const brand = await BrandModel.findByPk(id);

            if (!brand) {
                return res.status(404).json({ message: "Id thương hiệu không tồn tại" });
            }

            await brand.destroy();

            res.status(200).json({ message: "Xoá thương hiệu thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BrandController;
