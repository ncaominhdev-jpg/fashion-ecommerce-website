const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/productVariants.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

//Public - FE dùng để load các biến thể
router.get('/variant/list', VariantController.get);
router.get('/variant/:id', VariantController.getById);
router.get('/variant/product/:id', VariantController.getByProduct);

//Chỉ admin mới được thêm/sửa/xoá biến thể
router.post('/variant/add', checkJWT, isAdmin, VariantController.add);
router.put('/variant/:id', checkJWT, isAdmin, VariantController.update);
router.delete('/variant/:id', checkJWT, isAdmin, VariantController.delete);

module.exports = router;
