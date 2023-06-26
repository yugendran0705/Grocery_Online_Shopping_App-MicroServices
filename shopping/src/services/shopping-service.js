const { formatData } = require('../../../products/src/utils');
const { ShoppingRepository } = require('../database/repository/shopping-repository');
const { DefinedError } = require('../utils/error-handler');

class ShoppingService {
    constructor() {
        this.Repository = new ShoppingRepository();
    }

    getCart = async (customer_id) => {
        try {
            if (!customer_id) {
                throw new DefinedError("Customer id missing", 404);
            }
            const cart = await this.Repository.cart(customer_id);
            return cart;
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting cart", 500);
            }
        }
    }

    placeOrder = async (customer_id, TnxId) => {
        try {
            if (!customer_id || !TnxId) {
                throw new DefinedError("Customer id or transaction id missing", 404);
            }
            const order = await this.Repository.createNewOrder(customer_id, TnxId);
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
            if (!customer_id) {
                throw new DefinedError("Customer id missing", 404);
            }
            const orders = await this.Repository.orders(customer_id);
            return orders;
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting orders", 500);
            }
        }
    }

    manageCart = async (customer_id, item, quantity, isRemove) => {
        try {
            if (!customer_id || !item) {
                throw new DefinedError("Customer id, item and quantity missing", 404);
            }
            const cart = await this.Repository.addCartItem(customer_id, item, quantity, isRemove);
            return cart;
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error managing cart", 500);
            }
        }
    }

    subscribeEvent = async (payload) => {
        const { event, data } = payload;
        const { _id, product, quantity } = data;
        switch (event) {
            case "ADD_TO_CART":
                return await this.manageCart(_id, product, quantity, false);
            case "REMOVE_FROM_CART":
                return await this.manageCart(_id, product, quantity, true);
            case "PLACE_ORDER":
                return await this.placeOrder(_id, order);
            default:
                return;
        }
    }

    getOrderPayload = async (id, order, event) => {
        try {
            if (order) {
                const payload = {
                    event: event,
                    data: {
                        _id: id,
                        order: order
                    }
                }
                return formatData(payload);
            }
            else {
                return formatData({ message: "Order not available" });
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting order payload", 500);
            }
        }
    }
}

module.exports = { ShoppingService }