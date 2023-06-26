const { CustomerService } = require('../services/customer-service');
const service = new CustomerService();

const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body
        if (!email || !password || !phone || !name) {
            res.status(400).json({ message: "Email ,name ,password and phone are required" });
            return
        }
        const customer = await service.signUp(name, email, password, phone);
        res.status(201).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return
        }
        const customer = await service.signIn(email, password);
        res.status(200).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addNewAddress = async (req, res) => {
    try {
        const { _id, street, postalcode, city, country } = req.body
        if (!_id || !street || !postalcode || !city || !country) {
            res.status(400).json({ message: "Customer id, street, postalcode, city and country are required" });
            return
        }
        const address = await service.addNewAddress(_id, street, postalcode, city, country);
        res.status(201).json({ address });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getCustomer = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            res.status(400).json({ message: "Customer id is required" });
            return
        }
        const customer = await service.getCustomer(_id);
        res.status(200).json({ customer });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getCustomerOrders = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            res.status(400).json({ message: "Customer id is required" });
            return
        }
        const customer = await service.getCustomer(_id);
        const orders = customer.orders
        res.status(200).json({ orders });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getCustomerWishlist = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            res.status(400).json({ message: "Customer id is required" });
            return
        }
        const wishlist = await service.getWishlist(_id);
        res.status(200).json({ wishlist });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    signup,
    signin,
    addNewAddress,
    getCustomer,
    getCustomerOrders,
    getCustomerWishlist
}