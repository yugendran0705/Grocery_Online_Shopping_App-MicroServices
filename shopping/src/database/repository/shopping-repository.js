const { DefinedError } = require('../../utils/error-handler');
const OrderModel = require('../models/Order');
const CartModel = require('../models/Cart');

const { v4: uuidv4 } = require('uuid');

class ShoppingRepository {
    orders = async (_id) => {
        try {
            const orders = await OrderModel.find({ customerId: _id })
            return orders;
        }
        catch (err) {
            throw new DefinedError("Error finding orders", 500)
        }
    }

    cart = async (_id) => {
        try {
            const cart = await CartModel.find({ customerId: _id })
            if (!cart) {
                throw new DefinedError("Cart not found", 404)
            }
            return cart;
        }
        catch (err) {
            throw new DefinedError("Error finding cart", 500)
        }
    }

    addCartItem = async (customer_id, { _id, name, desc, banner, type, unit, price, available, suplier }, quantity, isRemove) => {
        try {
            const cart = await CartModel.findOne({ customerId: customer_id });
            if (cart) {
                let isExist = false;
                let CartItem = cart.items;
                if (CartItem === undefined) {
                    CartItem = [];
                }
                if (CartItem.length > 0) {
                    CartItem.map((item) => {
                        if (item.product._id.toString() === _id.toString()) {
                            if (isRemove) {
                                const index = CartItem.indexOf(item);
                                CartItem.splice(index, 1)
                            } else {
                                item.unit = quantity;
                            }
                            isExist = true;
                        }
                    })
                }
                if (!isExist && !isRemove) {
                    CartItem.push({ product: { _id, name, desc, type, unit, price, banner, available, suplier }, unit: quantity });
                }
                cart.items = CartItem;
                const updatedCart = await cart.save();
                return updatedCart.items;
            }
            else {
                console.log("inside else")
                await CartModel.create({
                    customerId: customer_id,
                    items: [{ product: { _id, name, desc, type, unit, price, banner, available, suplier }, unit: quantity }]
                });
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error adding item to cart", 500)
            }
        }
    }

    createNewOrder = async (customer_id, TnxId) => {
        try {
            const cart = await CartModel.findOne({ customerId: customer_id });
            if (cart) {
                let amount = 0;
                let cartItems = cart.items;
                if (cartItems.length > 0) {
                    cartItems.map((item) => {
                        amount += parseInt(item.product.price) * parseInt(item.unit);
                    })
                    const order = new OrderModel({
                        order_id: uuidv4(),
                        customerId: customer_id,
                        amount: amount,
                        status: "Pending",
                        tnxId: TnxId,
                        items: cartItems
                    });

                    cart.items = [];
                    const order_save = await order.save();
                    await cart.save();
                    return order_save;
                }
                else {
                    return null;
                }
            }
        }
        catch (err) {
            throw new DefinedError("Error creating order", 500)
        }
    }
}

module.exports = { ShoppingRepository }