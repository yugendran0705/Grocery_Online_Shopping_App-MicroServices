const express = require('express');
const router = express.Router();
const {
    createProduct,
    byCatogery,
    byId,
    manyById,
    addToWishlist,
    deleteFromWishlist,
    addToCart,
    deleteFromCart,
    getProducts
} = require('../controllers/products');
const { validateToken } = require('../middlewares/auth');

router.post('/create', validateToken, createProduct);
router.post('/ids', manyById);

router.get("/in/:type", byCatogery);
router.get('/:_id', byId);
router.get('/', getProducts);

router.put('/wishlist', validateToken, addToWishlist);
router.put('/cart', validateToken, addToCart);

router.delete('/wishlist/:id', validateToken, deleteFromWishlist);
router.delete('/cart/:id', validateToken, deleteFromCart);

module.exports = router;