const PaymentModel = require('../models/paymentModel');
const OrderModel = require('../models/orderModel');

class PaymentController {

    // Lấy tất cả giao dịch
    static async get(req, res) {
        try {
            const payments = await PaymentModel.findAll();
            res.status(200).json({
                message: 'Lấy danh sách thanh toán thành công',
                data: payments
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // Lấy theo order_id
    static async getByOrder(req, res) {
        try {
            const { order_id } = req.params;

            // Lấy đơn hàng để kiểm tra chủ sở hữu
            const order = await OrderModel.findByPk(order_id);
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            // Kiểm tra quyền truy cập
            if (req.user.id !== order.user_id && req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Bạn không có quyền xem thanh toán của đơn hàng này' });
            }

            // Nếu hợp lệ thì lấy thanh toán
            const payment = await PaymentModel.findOne({ where: { order_id } });

            if (!payment) {
                return res.status(404).json({ message: 'Không tìm thấy thanh toán cho đơn hàng này' });
            }

            res.status(200).json({ data: payment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // Thêm thanh toán mới
    static async add(req, res) {
        try {
            const { order_id, amount, payment_method, status } = req.body;

            const newPayment = await PaymentModel.create({
                order_id,
                amount,
                payment_method,
                status
            });

            res.status(201).json({
                message: 'Thêm thanh toán thành công',
                payment: newPayment
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật trạng thái thanh toán
    static async update(req, res) {
        try {
            const { id } = req.params;
            const payment = await PaymentModel.findByPk(id);

            if (!payment) {
                return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
            }

            await payment.update(req.body);
            res.status(200).json({
                message: 'Cập nhật thanh toán thành công',
                payment
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xoá thanh toán
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const payment = await PaymentModel.findByPk(id);

            if (!payment) {
                return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
            }

            await payment.destroy();
            res.status(200).json({ message: 'Xoá thanh toán thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PaymentController;