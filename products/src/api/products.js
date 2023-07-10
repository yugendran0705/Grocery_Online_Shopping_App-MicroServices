const { ProductService } = require('../services/product-service');
const service = new ProductService();
const { DefinedError } = require('../utils/error-handler');
const { publishMessage } = require('../utils/index');
const { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } = require('../config/index');
const { validateToken } = require('../middlewares/auth');

module.exports = (app, channel) => {

    app.get('/', async (req, res) => {
        res.status(200).json({ message: "Welcome to products service" });
    });
    app.post('/create', validateToken, async (req, res) => {
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
    });

    app.get('/ids', async (req, res) => {
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
    });
    app.get("/in/:type", async (req, res) => {
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
    });
    app.get('/:_id', async (req, res) => {
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
    });
    app.get('/', async (req, res) => {
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
    });

    app.put('/wishlist', validateToken, async (req, res) => {
        try {
            const { customerId, productId } = req.body;
            if (!customerId || !productId) {
                res.status(400).json({ message: "Customer id and product id are required" });
                return
            }
            const data_recieved = await service.getProductPayload(customerId, { productId: productId }, "ADD_TO_WISHLIST");

            await publishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data_recieved));

            res.status(200).json(data_recieved.data.product);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                res.status(err.statusCode).json({ message: err.message });
                return
            }
            res.status(500).json({ message: err.message });
        }
    });

    app.put('/cart', validateToken, async (req, res) => {
        try {
            const { customerId, productId, quantity } = req.body;
            if (!customerId || !productId || !quantity) {
                res.status(400).json({ message: "Customer id, product id and quantity are required" });
                return
            }
            const data_recieved = await service.getProductPayload(customerId, { productId: productId, quantity: quantity }, "ADD_TO_CART");

            await publishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data_recieved));

            await publishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data_recieved));

            res.status(200).json(data_recieved.data.product);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                res.status(err.statusCode).json({ message: err.message });
                return
            }
            res.status(500).json({ message: err.message });
        }
    });

    app.delete('/wishlist/:id', validateToken, async (req, res) => {
        try {
            const { customerId } = req.body;
            const { id } = req.params;
            if (!customerId || !id) {
                res.status(400).json({ message: "Customer id and product id are required" });
                return
            }
            const data_recieved = await service.getProductPayload(customerId, { productId: id }, "REMOVE_FROM_WISHLIST");

            await publishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data_recieved));

            res.status(200).json(data_recieved.data.product);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                res.status(err.statusCode).json({ message: err.message });
                return
            }
            res.status(500).json({ message: err.message });
        }
    });
    app.delete('/cart/:id', validateToken, async (req, res, next) => {
        try {
            const { customerId } = req.body;
            const { id } = req.params;
            if (!customerId || !id) {
                res.status(400).json({ message: "Customer id and product id are required" });
                return
            }
            const data_recieved = await service.getProductPayload(customerId, { productId: id }, "REMOVE_FROM_CART");

            await publishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data_recieved));

            await publishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data_recieved));

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
    );

}