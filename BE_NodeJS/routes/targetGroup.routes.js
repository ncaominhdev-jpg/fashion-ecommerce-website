const express = require('express');
const router = express.Router();
const TargetGroupController = require('../controllers/targetGroup.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

// Public – dùng cho FE hiển thị
router.get('/target-group/list', TargetGroupController.getAll);
router.get('/target-group/:id', TargetGroupController.getById);

// Admin – dùng cho trang quản trị
router.post('/target-group/add', checkJWT, isAdmin, TargetGroupController.create);
router.put('/target-group/:id', checkJWT, isAdmin, TargetGroupController.update);
router.delete('/target-group/:id', checkJWT, isAdmin, TargetGroupController.delete);

module.exports = router;
