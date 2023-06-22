const { DefinedError } = require('../../utils/error-handler');
const OrderModel = require('../models/Order');
const CustomerModel = require('../models/Customer');

const { v4: uuidv4 } = require('uuid');

class ShoppingRepository {
    orders = async ({ _id }) => {
        try {
            const orders = await OrderModel.find({ customer: _id });
            return orders;
        }
        catch (err) {
            throw new DefinedError("Error finding orders", 500)
        }
    }

    createNewOrder = async ({ customer_id, TnxId }) => {
        try {
            const profile = await CustomerModel.findById(customer_id).populate('cart.product');
            if (!profile) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                var amount = 0;
                profile.cart.forEach(element => {
                    amount = amount + element.product.price;
                }
                );
                const order = new OrderModel({
                    order_id: uuidv4(),
                    customer: customer_id,
                    amount: amount,
                    status: "Pending",
                    tnxId: TnxId,
                    items: profile.cart
                });

                profile.cart = [];
                order.populate('items.product');
                const order_save = await order.save();
                profile.orders.push(order_save);
                await profile.save();
                return order_save;
            }
        }
        catch (err) {
            throw new DefinedError("Error creating order", 500)
        }
    }
}

module.exports = { ShoppingRepository }