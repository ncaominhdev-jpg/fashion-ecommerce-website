const express = require('express');
const router = express.Router();
const SizeController = require('../controllers/size.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

//Public – dùng cho FE hiển thị
router.get('/size/list', SizeController.get);
router.get('/size/:id', SizeController.getById);

//Admin – quản lý size
router.post('/size/add', checkJWT, isAdmin, SizeController.create);
router.put('/size/:id', checkJWT, isAdmin, SizeController.update);
router.delete('/size/:id', checkJWT, isAdmin, SizeController.delete);

module.exports = router;
