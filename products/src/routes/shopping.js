const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderDetails,
    getCartDetails
} = require('../controllers/shopping');
const { validateToken } = require('../middlewares/auth');

router.post('/order', validateToken, createOrder);

router.get('/orders', validateToken, getOrderDetails);
router.get('/cart', validateToken, getCartDetails);

module.exports = router;