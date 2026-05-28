const express = require('express');
const router = express.Router();
const ColorController = require('../controllers/color.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck'); // Thêm middleware

//Public - FE lấy danh sách màu
router.get('/color/list', ColorController.get);
router.get('/color/:id', ColorController.getById);

//Admin - quản lý màu
router.post('/color/add', checkJWT, isAdmin, ColorController.create);
router.put('/color/:id', checkJWT, isAdmin, ColorController.update);
router.delete('/color/:id', checkJWT, isAdmin, ColorController.delete);

module.exports = router;
