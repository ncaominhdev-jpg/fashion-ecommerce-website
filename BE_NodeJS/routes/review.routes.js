const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

//Công khai – hiển thị đánh giá
router.get('/review/count', ReviewController.getCommentCount);
router.get('/review/list', ReviewController.get);
router.get('/review/product/:id', ReviewController.getByProduct);

//Người dùng phải đăng nhập mới được gửi đánh giá
router.post('/review/add', checkJWT, ReviewController.add);

//Chỉ chủ review hoặc admin được sửa/xoá (kiểm tra trong controller)
router.put('/review/:id', checkJWT, ReviewController.update);
router.delete('/review/:id', checkJWT, ReviewController.delete);

module.exports = router;
