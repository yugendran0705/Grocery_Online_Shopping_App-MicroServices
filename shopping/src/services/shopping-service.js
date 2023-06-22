const { ShoppingRepository } = require('../database/repository/shopping-repository');
const { DefinedError } = require('../utils/error-handler');

class ShoppingService {
    constructor() {
        this.Repository = new ShoppingRepository();
    }

    placeOrder = async (customer_id, TnxId) => {
        try {
            const order = await this.Repository.createNewOrder({ customer_id, TnxId });
            return order;
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error placing order", 500);
            }
        }
    }

    getOrders = async (customer_id) => {
        try {
            const orders = await this.Repository.orders({ _id: customer_id });
            return orders;
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting orders", 500);
            }
        }
    }
}

module.exports = { ShoppingService }