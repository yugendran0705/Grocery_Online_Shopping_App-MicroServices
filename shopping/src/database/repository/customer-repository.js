const CustomerModel = require('../models/Customer');
const AddressModel = require('../models/Address');
const { DefinedError } = require('../../utils/error-handler');
class CustomerRepository {
    createCustomer = async ({ name, email, password, phone, salt }) => {
        try {
            const customer_check = await CustomerModel.findOne({ email: email });
            if (customer_check) {
                throw new DefinedError("Account already exists", 409)
            }
            else {
                const customer = await CustomerModel.create({ name, email, password, phone, salt });
                return customer;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error creating customer", 500)
            }
        }
    }

    createAddress = async ({ _id, street, postalcode, city, country }) => {
        try {
            const customer = await CustomerModel.findById(_id);
            console.log(customer);
            if (!customer) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                const address = await AddressModel.create({ street, postalcode, city, country });
                customer.address.push(address._id);
                await customer.save();
                return address;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error creating address", 500)
            }
        }
    }

    findCustomer = async ({ email }) => {
        try {
            const customer_check = await CustomerModel.findOne({ email: email });
            if (!customer_check) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                return customer_check;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error finding customer", 500)
            }
        }
    }

    findCustomerById = async ({ id }) => {
        try {
            const customer_check = await CustomerModel.findOne(id);
            if (!customer_check) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                return customer_check;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error finding customer", 500)
            }
        }
    }

    wishlist = async ({ customer_id }) => {
        try {
            const profile = await CustomerModel.findById(customer_id).populate('wishlist');
            return profile.wishlist;
        }
        catch (err) {
            throw new DefinedError("Error finding wishlist", 500)
        }
    }

    addToWishlist = async ({ customer_id, product }) => {
        try {
            const customer = await CustomerModel.findById(customer_id).populate('wishlist');
            if (!customer) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                let wishlist = customer.wishlist;
                if (wishlist.length > 0) {
                    let isExist = false;
                    wishlist.map((item) => {
                        if (item._id.toString() === product._id.toString()) {
                            const index = wishlist.indexOf(item);
                            wishlist.splice(index, 1);
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        wishlist.push(product);
                    }
                } else {
                    wishlist.push(product);
                }
                customer.wishlist = wishlist;
            }
            await customer.save();
            return customer.wishlist;
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error adding to wishlist", 500)
            }
        }
    }

    addCartItems = async ({ customer_id, product, qty, isRemove }) => {
        try {
            const customer = await CustomerModel.findById(customer_id).populate('cart.product');
            if (!customer) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                const cartItem = {
                    product,
                    unit: qty
                }
                let cart = customer.cart;
                if (cart.length > 0) {
                    let isExist = false;
                    cart.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                            const index = cart.indexOf(item);
                            cart.splice(index, 1);
                            isExist = true;
                        }
                    });
                    if (!isExist) {
                        cart.push(cartItem);
                    }
                }
                else {
                    cart.push(cartItem);
                }
                customer.cart = cart;
                const updatedCustomer = await customer.save();
                return updatedCustomer.cart;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error adding to cart", 500)
            }
        }
    }

    addOrderToProfile = async ({ customer_id, order }) => {
        try {
            const customer = await CustomerModel.findById(customer_id);
            if (!customer) {
                throw new DefinedError("Customer not found", 404)
            }
            else {
                if (customer.orders === undefined) {
                    customer.orders = [];
                }
                customer.orders.push(order);
                customer.cart = [];
                await customer.save();
                return customer.orders;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error adding order to profile", 500)
            }
        }
    }
}

module.exports = { CustomerRepository }