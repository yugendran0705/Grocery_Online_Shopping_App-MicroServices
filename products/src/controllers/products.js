const { ProductService } = require('../services/product-service');
const { publishCustomerEvent, publishShoppingEvent } = require('../utils/index');
const service = new ProductService();
const { DefinedError } = require('../utils/error-handler');

const createProduct = async (req, res) => {
    try {
        const { name, desc, type, unit, price, available, suplier, banner } = req.body;
        if (!name || !desc || !type || !unit || !price || !available || !suplier || !banner) {
            res.status(400).json({ message: "Name, desc, type, unit, price, available, suplier and banner are required" });
            return
        }
        const product = await service.createProduct(req.body);
        res.status(200).json(product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const byCatogery = async (req, res) => {
    try {
        const { type } = req.params;
        if (!type) {
            res.status(400).json({ message: "Type is required" });
            return
        }
        const product = await service.getProductByCategory(type);
        res.status(200).json(product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const byId = async (req, res) => {
    try {
        const _id = req.params;
        if (!_id) {
            res.status(400).json({ message: "Id is required" });
            return
        }
        const product = await service.getProductById(_id);
        res.status(200).json(product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const manyById = async (req, res) => {
    try {
        const { ids } = req.body;
        if (ids.length === 0) {
            res.status(400).json({ message: "Ids are required" });
            return
        }
        const products = await service.getSelectedProducts(ids);
        res.status(200).json({ products });
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { customerId, productId } = req.body;
        if (!customerId || !productId) {
            res.status(400).json({ message: "Customer id and product id are required" });
            return
        }
        const data_recieved = await service.getProductPayload(customerId, { productId: productId }, "ADD_TO_WISHLIST");
        await publishCustomerEvent(data_recieved);
        res.status(200).json(data_recieved.data.product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const deleteFromWishlist = async (req, res) => {
    try {
        const { customerId } = req.body;
        const { id } = req.params;
        if (!customerId || !id) {
            res.status(400).json({ message: "Customer id and product id are required" });
            return
        }
        const data_recieved = await service.getProductPayload(customerId, { productId: id }, "REMOVE_FROM_WISHLIST");
        await publishCustomerEvent(data_recieved);
        res.status(200).json(data_recieved.data.product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const addToCart = async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;
        if (!customerId || !productId || !quantity) {
            res.status(400).json({ message: "Customer id, product id and quantity are required" });
            return
        }
        const data_recieved = await service.getProductPayload(customerId, { productId: productId, quantity: quantity }, "ADD_TO_CART");
        await publishCustomerEvent(data_recieved);
        await publishShoppingEvent(data_recieved);
        res.status(200).json(data_recieved.data.product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const deleteFromCart = async (req, res, next) => {
    try {
        const { customerId } = req.body;
        const { id } = req.params;
        if (!customerId || !id) {
            res.status(400).json({ message: "Customer id and product id are required" });
            return
        }
        const data_recieved = await service.getProductPayload(customerId, { productId: id }, "REMOVE_FROM_CART");
        await publishCustomerEvent(data_recieved);
        await publishShoppingEvent(data_recieved);
        res.status(200).json(data_recieved.data.product);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
        res.status(500).json({ message: err.message });
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await service.getProducts();
        res.status(200).json(products);
    }
    catch (err) {
        if (err instanceof DefinedError) {
            res.status(err.statusCode).json({ message: err.message });
            return
        }
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
