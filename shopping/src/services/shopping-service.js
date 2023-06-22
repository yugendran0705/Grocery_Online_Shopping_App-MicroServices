const { formatData } = require('../../../products/src/utils');
const { ShoppingRepository } = require('../database/repository/shopping-repository');
const { DefinedError } = require('../utils/error-handler');

class ShoppingService {
    constructor() {
        this.Repository = new ShoppingRepository();
    }

    getCart = async (customer_id) => {
        try {
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

    manageCart = async (customer_id, item, qty, isRemove) => {
        try {
            const cart = await this.Repository.addCartItem(customer_id, item, qty, isRemove);
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
        const { _id, product, qty } = data;
        switch (event) {
            case "ADD_TO_CART":
                return await this.manageCart(_id, product, qty);
            case "REMOVE_FROM_CART":
                return await this.manageCart(_id, product, qty, true);
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