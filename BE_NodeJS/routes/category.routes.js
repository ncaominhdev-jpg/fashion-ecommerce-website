const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

// Công khai - FE có thể gọi

router.get('/category/list', CategoryController.get);
router.get('/category/:id', CategoryController.getById);
router.get('/category/active', CategoryController.getActiveCategories);
//Chỉ admin mới được thực hiện
router.post('/category/add', checkJWT, isAdmin, CategoryController.create);
router.put('/category/:id', checkJWT, isAdmin, CategoryController.update);
router.delete('/category/:id', checkJWT, isAdmin, CategoryController.delete);

module.exports = router;
