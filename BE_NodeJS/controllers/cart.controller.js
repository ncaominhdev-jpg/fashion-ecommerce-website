const CartModel = require("../models/cartModel");
const ProductVariantModel = require("../models/productVariantsModel");
const ProductModel = require("../models/productsModel");
const SizeModel = require("../models/sizeModel");
const ColorModel = require("../models/colorModel");

class CartController {
  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;

      if (Number(req.user?.id) !== Number(user_id) && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền xem giỏ hàng này" });
      }

      const cartItems = await CartModel.findAll({
        where: { user_id },
        include: [
          {
            model: ProductVariantModel,
            as: "variant",
            include: [
              {
                model: ProductModel,
                as: "product",
                attributes: ["id", "name", "image", "price", "sale_price"],
              },
              {
                model: SizeModel,
                as: "size",
                attributes: ["id", "size_label"],
              },
              {
                model: ColorModel,
                as: "color",
                attributes: ["id", "color_name", "color_code"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const data = cartItems.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product_id: item.variant?.product?.id,
        name: item.variant?.product?.name,
        image: item.variant?.product?.image,
        price: item.variant?.product?.price,
        sale_price: item.variant?.product?.sale_price,
        size: item.variant?.size?.size_label,
        color: item.variant?.color?.color_name || item.variant?.color?.color_code,
      }));

      res.status(200).json({
        message: "Lấy giỏ hàng thành công",
        data,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy giỏ hàng", error: error.message });
    }
  }

  static async add(req, res) {
    try {
      const user_id = req.user?.id || req.body.user_id;
      const variant_id = Number(req.body.variant_id);
      const quantity = Number(req.body.quantity || 1);

      if (!user_id) {
        return res.status(401).json({ message: "Vui lòng đăng nhập để thêm vào giỏ hàng" });
      }

      if (!variant_id || quantity < 1) {
        return res.status(400).json({ message: "Thông tin sản phẩm hoặc số lượng không hợp lệ" });
      }

      const existingItem = await CartModel.findOne({
        where: { user_id, variant_id },
      });

      if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + quantity;
        await existingItem.save();

        return res.status(200).json({
          message: "Cập nhật số lượng giỏ hàng thành công",
          item: existingItem,
        });
      }

      const newItem = await CartModel.create({ user_id, variant_id, quantity });

      res.status(201).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        item: newItem,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể thêm vào giỏ hàng", error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const quantity = Number(req.body.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }

      const item = await CartModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy mục trong giỏ" });
      }

      if (Number(req.user?.id) !== Number(item.user_id) && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền cập nhật mục này" });
      }

      item.quantity = quantity;
      await item.save();

      res.status(200).json({
        message: "Cập nhật số lượng thành công",
        item,
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể cập nhật giỏ hàng", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const item = await CartModel.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy mục trong giỏ" });
      }

      if (Number(req.user?.id) !== Number(item.user_id) && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền xóa mục này" });
      }

      await item.destroy();
      res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa sản phẩm khỏi giỏ hàng", error: error.message });
    }
  }
}

module.exports = CartController;
