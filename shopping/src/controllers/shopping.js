const { ShoppingService } = require('../services/shopping-service');
const service = new ShoppingService();
const { publishCustomerEvent, publishProductEvent } = require('../utils/index');

const createOrder = async (req, res) => {
    try {
        const { _id, txn_id } = req.body
        if (!_id || !txn_id) {
            res.status(400).json({ message: "Customer id and txn id are required" });
            return
        }
        const order = await service.placeOrder(_id, txn_id);
        const payload = await service.getOrderPayload(_id, order, "ADD_TO_ORDER");
        await publishCustomerEvent(payload);
        res.status(200).json(order);
    }
    catch (err) {
        res.status(err.statusCode).json({ message: err.message });
    }
}

const getOrderDetails = async (req, res) => {
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
        res.status(err.statusCode).json({ message: err.message });
    }
}

const getCartDetails = async (req, res, next) => {
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
        res.status(err.statusCode).json({ message: err.message });
    }
}


module.exports = {
    createOrder,
    getOrderDetails,
    getCartDetails
}