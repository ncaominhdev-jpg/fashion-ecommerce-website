const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { checkJWT, isAdmin } = require('../middleware/authCheck');

//Admin xem và quản lý user
router.get('/user/count', UserController.getUserCount);
router.get('/user/list', checkJWT, isAdmin, UserController.getAllUsers);
router.get('/user/:id', checkJWT, isAdmin, UserController.getById);
router.post('/user/add', checkJWT, isAdmin, UserController.create);
router.put('/user/:id', checkJWT, isAdmin, UserController.update);
router.delete('/user/:id', checkJWT, isAdmin, UserController.delete);
router.put('/user/update-role/:id', checkJWT, isAdmin, UserController.updateRole);
//Các route người dùng tự xử lý
router.post('/user/login', UserController.login);
router.post('/user/register', UserController.register);
router.get('/user/profile/:id', checkJWT, UserController.getProfile);
router.put('/user/update-password/:id', checkJWT, UserController.updatePassword);
router.post('/user/reset-password', checkJWT, UserController.resetPassword);
router.put('/user/update-user/:id', checkJWT, UserController.updateUser)

module.exports = router;
