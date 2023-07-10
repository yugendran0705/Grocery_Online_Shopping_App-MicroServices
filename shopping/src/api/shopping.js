const { ShoppingService } = require('../services/shopping-service');
const { DefinedError } = require('../utils/error-handler')
const { validateToken } = require('../middlewares/auth');
const { subscribeMessage } = require('../utils/index')
const { CUSTOMER_BINDING_KEY } = require('../config/index')
const { publishMessage } = require('../utils/index')

module.exports = async (app, channel) => {
    const service = new ShoppingService();
    await subscribeMessage(channel, service)

    app.get('/', async (req, res) => {
        res.status(200).json({ message: "Welcome to shopping service" });
    });
    app.post('/order', validateToken, async (req, res) => {
        try {
            const { _id, txn_id } = req.body
            if (!_id || !txn_id) {
                res.status(400).json({ message: "Customer id and txn id are required" });
                return
            }
            const order = await service.placeOrder(_id, txn_id);

            const payload = await service.getOrderPayload(_id, order, "ADD_TO_ORDER");

            await publishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));

            res.status(200).json(order);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                res.status(err.statusCode).json({ message: err.message });
                return
            }
            res.status(500).json({ message: err.message });

        }
    });

    app.get('/orders', validateToken, async (req, res) => {
        try {
            const { _id } = req.body
            if (!_id) {
                res.status(400).json({ message: "Customer id is required" });
                return
            }
            const orders = await service.getOrders(_id);
            res.status(200).json(orders);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                res.status(err.statusCode).json({ message: err.message });
                return
            }
            res.status(500).json({ message: err.message });
        }
    });
    app.get('/cart', validateToken, async (req, res, next) => {
        try {
            const { _id } = req.body
            if (!_id) {
                res.status(400).json({ message: "Customer id is required" });
                return
            }
            const cart = await service.getCart(_id);
            res.status(200).json({ cart });
        }
        catch (err) {
            if (err instanceof DefinedError) {
                res.status(err.statusCode).json({ message: err.message });
                return
            }
            res.status(500).json({ message: err.message });
        }
    });

}
