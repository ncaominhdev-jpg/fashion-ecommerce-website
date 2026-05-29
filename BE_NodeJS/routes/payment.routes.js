const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

//Admin xem toàn bộ thanh toán
router.get('/payment/list', checkJWT, isAdmin, PaymentController.get);

//Người dùng xem thanh toán của đơn hàng của họ (có kiểm tra trong controller)
router.get('/payment/order/:order_id', checkJWT, PaymentController.getByOrder);

//Người dùng tạo thanh toán sau khi đặt hàng (COD hoặc Momo)
router.post('/payment/add', checkJWT, PaymentController.add);

//Admin cập nhật trạng thái thanh toán
router.put('/payment/:id', checkJWT, isAdmin, PaymentController.update);

//Admin có thể xoá thanh toán nếu cần
router.delete('/payment/:id', checkJWT, isAdmin, PaymentController.delete);

module.exports = router;
