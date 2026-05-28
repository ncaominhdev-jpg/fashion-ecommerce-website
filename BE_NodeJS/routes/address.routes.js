const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/address.controller');
const { checkJWT } = require('../middleware/authCheck');

router.get('/address/user/:user_id', checkJWT, AddressController.getByUser);
router.get('/address/:id', checkJWT, AddressController.getById);
router.post('/address/add', checkJWT, AddressController.add);
router.put('/address/:id', checkJWT, AddressController.update);
router.delete('/address/:id', checkJWT, AddressController.delete);

module.exports = router;
