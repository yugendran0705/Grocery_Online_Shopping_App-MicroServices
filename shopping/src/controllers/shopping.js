const { ShoppingService } = require('../services/shopping-service');
const service = new ShoppingService();
const { CustomerService } = require('../services/customer-service');
const userService = new CustomerService();

const createOrder = async (req, res, next) => {
    try {
        const { _id, txn_id } = req.body
        if (!_id || !txn_id) {
            res.status(400).json({ message: "Customer id and txn id are required" });
            return
        }
        const order = await service.createOrder(_id, txn_id);
        res.status(200).json({ order });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getOrderDetails = async (req, res, next) => {
    try {
        const { _id } = req.body
        if (!_id) {
            res.status(400).json({ message: "Customer id is required" });
            return
        }
        const customer = await userService.getShoppingDetails(req.body);
        const orders = customer.orders
        res.status(200).json({ orders });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getCartDetails = async (req, res, next) => {
    try {
        const { _id } = req.body
        if (!_id) {
            res.status(400).json({ message: "Customer id is required" });
            return
        }
        const customer = await userService.getShoppingDetails(req.body);
        const cart = customer.cart
        res.status(200).json({ cart });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    createOrder,
    getOrderDetails,
    getCartDetails
}