const connection = require('../database');
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Payment = require('../models/paymentModel');
const ProductVariant = require('../models/productVariantsModel');
const Product = require('../models/productsModel');
const Size = require('../models/sizeModel');
const Color = require('../models/colorModel');
const User = require('../models/usersModel');
const Address = require('../models/addressModel');

const isAdmin = (user) => user?.role === 'admin';

class OrderController {
  static async get(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: 'userOrder',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Address,
            as: 'orderAddress',
            attributes: ['id', 'address', 'phone', 'recipient_name'],
          },
          {
            model: Payment,
            as: 'payment',
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({
        message: 'Lấy danh sách đơn hàng thành công',
        data: orders,
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'userOrder',
            attributes: ['id', 'name', 'email', 'phone'],
          },
          {
            model: Address,
            as: 'orderAddress',
            attributes: ['id', 'address', 'phone', 'recipient_name'],
          },
          {
            model: OrderDetail,
            as: 'details',
            include: [
              {
                model: ProductVariant,
                as: 'variant',
                include: [
                  { model: Product, as: 'product', attributes: ['id', 'name', 'image', 'price', 'sale_price'] },
                  { model: Size, as: 'size', attributes: ['id', 'size_label'] },
                  { model: Color, as: 'color', attributes: ['id', 'color_name', 'color_code'] },
                ],
              },
            ],
          },
          {
            model: Payment,
            as: 'payment',
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      if (Number(req.user?.id) !== Number(order.user_id) && !isAdmin(req.user)) {
        return res.status(403).json({ message: 'Không có quyền truy cập đơn hàng này.' });
      }

      const data = order.toJSON();
      data.user = data.userOrder;
      data.address = data.orderAddress;
      delete data.userOrder;
      delete data.orderAddress;

      res.status(200).json({ data });
    } catch (error) {
      console.error('Lỗi lấy đơn hàng theo ID:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getByUser(req, res) {
    const user_id = req.params.user_id || req.params.id;

    if (Number(user_id) !== Number(req.user.id) && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Không có quyền truy cập đơn hàng này.' });
    }

    try {
      const orders = await Order.findAll({
        where: { user_id },
        include: [
          {
            model: Address,
            as: 'orderAddress',
            attributes: ['id', 'address', 'phone', 'recipient_name'],
          },
          {
            model: Payment,
            as: 'payment',
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({ message: 'Lấy đơn hàng của bạn thành công', data: orders });
    } catch (error) {
      console.error('Lỗi lấy đơn hàng của người dùng:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    const transaction = await connection.transaction();

    try {
      const user_id = req.user?.id;
      const { address_id, note, payment_method, products = [] } = req.body;
      const shippingFee = Number(req.body.shipping_fee ?? 30000);
      const discount = Number(req.body.discount ?? 0);

      if (!user_id) {
        await transaction.rollback();
        return res.status(401).json({ message: 'Vui lòng đăng nhập để đặt hàng' });
      }

      if (!address_id) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Vui lòng chọn địa chỉ nhận hàng' });
      }

      if (!['COD', 'Momo'].includes(payment_method)) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
      }

      if (!Array.isArray(products) || products.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Đơn hàng phải có ít nhất một sản phẩm' });
      }

      const address = await Address.findOne({
        where: { id: address_id, user_id },
        transaction,
      });

      if (!address) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Địa chỉ nhận hàng không hợp lệ' });
      }

      const newOrder = await Order.create(
        {
          user_id,
          address_id,
          note: note || '',
          status: 'pending',
        },
        { transaction }
      );

      let subTotal = 0;
      const orderDetails = [];

      for (const item of products) {
        const variant_id = Number(item.variant_id);
        const quantity = Number(item.quantity || 1);

        if (!variant_id || quantity < 1) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Sản phẩm trong đơn hàng không hợp lệ' });
        }

        const variant = await ProductVariant.findByPk(variant_id, {
          include: [{ model: Product, as: 'product' }],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!variant || !variant.product) {
          await transaction.rollback();
          return res.status(404).json({ message: 'Không tìm thấy biến thể sản phẩm' });
        }

        if (Number(variant.stock) < quantity) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Sản phẩm ${variant.product.name} chỉ còn ${variant.stock} sản phẩm`,
          });
        }

        const originalPrice = Number(variant.product.price || 0);
        const salePrice = Number(variant.product.sale_price || 0);
        const finalPrice = salePrice > 0 && salePrice < originalPrice ? salePrice : originalPrice;

        subTotal += finalPrice * quantity;
        orderDetails.push({
          order_id: newOrder.id,
          variant_id,
          quantity,
          price: finalPrice,
        });

        await variant.update(
          { stock: Number(variant.stock) - quantity },
          { transaction }
        );
      }

      await OrderDetail.bulkCreate(orderDetails, { transaction });

      const amount = Math.max(0, subTotal + shippingFee - discount);
      const payment = await Payment.create(
        {
          order_id: newOrder.id,
          amount,
          payment_method,
          status: 'pending',
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json({
        message: 'Tạo đơn hàng thành công',
        order: newOrder,
        details: orderDetails,
        payment,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    const transaction = await connection.transaction();

    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, { transaction });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      const previousStatus = order.status;
      const nextStatus = isAdmin(req.user) ? req.body.status : 'canceled';

      if (!isAdmin(req.user)) {
        const ownsOrder = Number(order.user_id) === Number(req.user.id);
        const wantsCancel = req.body.status === 'canceled';

        if (!ownsOrder || !wantsCancel || order.status !== 'pending') {
          await transaction.rollback();
          return res.status(403).json({ message: 'Bạn không có quyền cập nhật đơn hàng này' });
        }
      }

      if (nextStatus === 'canceled' && previousStatus !== 'canceled') {
        const details = await OrderDetail.findAll({
          where: { order_id: order.id },
          transaction,
        });

        for (const detail of details) {
          const variant = await ProductVariant.findByPk(detail.variant_id, {
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (variant) {
            await variant.update(
              { stock: Number(variant.stock || 0) + Number(detail.quantity || 0) },
              { transaction }
            );
          }
        }
      }

      await order.update(isAdmin(req.user) ? req.body : { status: 'canceled' }, { transaction });
      await transaction.commit();

      res.status(200).json({
        message: 'Cập nhật đơn hàng thành công',
        order,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      await order.destroy();
      res.status(200).json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderCount(req, res) {
    try {
      const count = await Order.count();
      res.status(200).json({ count });
    } catch (error) {
      console.error('Lỗi khi lấy số lượng đơn hàng:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
