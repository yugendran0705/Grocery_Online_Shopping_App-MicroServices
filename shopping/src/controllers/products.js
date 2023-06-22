const { ProductService } = require('../services/product-service');
const { CustomerService } = require('../services/customer-service');
const service = new ProductService();
const customerService = new CustomerService();

const createProduct = async (req, res, next) => {
    try {
        const { name, desc, type, unit, price, available, suplier, banner } = req.body;
        if (!name || !desc || !type || !unit || !price || !available || !suplier || !banner) {
            res.status(400).json({ message: "Name, desc, type, unit, price, available, suplier and banner are required" });
            return
        }
        const product = await service.createProduct(req.body);
        res.status(200).json({ product });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const byCatogery = async (req, res, next) => {
    try {
        const { type } = req.params.type;
        if (!type) {
            res.status(400).json({ message: "Type is required" });
            return
        }
        const product = await service.getProductByCategory(req.body);
        res.status(200).json({ product });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const byId = async (req, res, next) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ message: "Id is required" });
            return
        }
        const product = await service.getProductById(_id);
        res.status(200).json({ product });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const manyById = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!ids) {
            res.status(400).json({ message: "Ids are required" });
            return
        }
        const products = await service.getSelectedProducts(ids);
        res.status(200).json({ products });

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addToWishlist = async (req, res, next) => {
    try {
        const { customerId, productId } = req.body;
        if (!customerId || !productId) {
            res.status(400).json({ message: "Customer id and product id are required" });
            return
        }
        const product = await service.getProductById(productId);
        const customer = await customerService.addToWishlist(customerId, product);
        res.status(200).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteFromWishlist = async (req, res, next) => {
    try {
        const { customerId } = req.body;
        const { productId } = req.params;
        if (!customerId || !productId) {
            res.status(400).json({ message: "Customer id and product id are required" });
            return
        }
        const product = await service.getProductById(productId);
        const customer = await customerService.addToWishlist(customerId, product);
        res.status(200).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addToCart = async (req, res, next) => {
    try {
        const { customerId, productId, quantity } = req.body;
        if (!customerId || !productId || !quantity) {
            res.status(400).json({ message: "Customer id, product id and quantity are required" });
            return
        }
        const product = await service.getProductById(productId);
        const customer = await customerService.manageCart(customerId, product, quantity, false);
        res.status(200).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteFromCart = async (req, res, next) => {
    try {
        const { customerId } = req.body;
        const { productId } = req.params;
        if (!customerId || !productId) {
            res.status(400).json({ message: "Customer id and product id are required" });
            return
        }
        const product = await service.getProductById(productId);
        const customer = await customerService.manageCart(customerId, product, 0, true);
        res.status(200).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getProducts = async (req, res, next) => {
    try {
        const products = await service.getProducts();
        res.status(200).json({ products });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createProduct,
    byCatogery,
    byId,
    manyById,
    addToWishlist,
    deleteFromWishlist,
    addToCart,
    deleteFromCart,
    getProducts
}
