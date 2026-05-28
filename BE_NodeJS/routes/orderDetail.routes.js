const express = require('express');
const router = express.Router();
const OrderDetailController = require('../controllers/orderDetail.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

//Chỉ admin được xem tất cả chi tiết đơn
router.get('/order-detail/list', checkJWT, isAdmin, OrderDetailController.get);

//Người dùng được xem chi tiết đơn hàng của họ (kiểm tra trong controller)
router.get('/order-detail/order/:id', checkJWT, OrderDetailController.getByOrder);

//Thêm chi tiết đơn hàng khi đặt hàng (FE gọi sau khi tạo order)
router.post('/order-detail/add', checkJWT, OrderDetailController.add);

//Cập nhật chi tiết đơn hàng (chỉ admin mới làm được)
router.put('/order-detail/:id', checkJWT, isAdmin, OrderDetailController.update);

//Xoá dòng chi tiết (chỉ admin)
router.delete('/order-detail/:id', checkJWT, isAdmin, OrderDetailController.delete);

module.exports = router;
