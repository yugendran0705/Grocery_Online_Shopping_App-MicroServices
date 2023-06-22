const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    addNewAddress,
    getCustomer,
    getCustomerOrders,
    getCustomerWishlist
} = require('../controllers/customer');
const { validateToken } = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/address', validateToken, addNewAddress);

router.get('/profile', validateToken, getCustomer);
router.get('/shoppingdetails', validateToken, getCustomerOrders);
router.get('/wishlist', validateToken, getCustomerWishlist);

module.exports = router;