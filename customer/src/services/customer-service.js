const { CustomerRepository } = require('../database/repository/customer-repository')
const { generateSalt, generatePassword, generateToken, formatData, validatePassword } = require('../utils');
const { DefinedError } = require('../utils/error-handler');

class CustomerService {
    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    signIn = async (email, password) => {
        try {
            if (!email || !password) {
                throw new DefinedError("Email and password missing", 404);
            }
            const customer = await this.customerRepository.findCustomer(email);
            if (customer) {
                const validPassword = await validatePassword(password, customer.password, customer.salt);
                if (validPassword) {
                    const token = await generateToken({ email: customer.email, id: customer._id });
                    return formatData({ id: customer._id, token });
                }
            }

            return formatData(null);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error signing in", 500);
            }
        }
    }

    signUp = async (name, email, password, phone) => {
        try {
            if (!name || !email || !password || !phone) {
                throw new DefinedError("Name, email, password and phone missing", 404);
            }
            const salt = await generateSalt();
            const hash = await generatePassword(password, salt);
            const customer = await this.customerRepository.createCustomer(name, email, hash, phone, salt);
            const token = await generateToken({ email: customer.email, _id: customer._id });
            return formatData({ id: customer._id, token });
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error signing up", 500);
            }
        }
    }

    addNewAddress = async (_id, street, postalcode, city, country) => {
        try {
            if (!_id || !street || !postalcode || !city || !country) {
                throw new DefinedError("customer id, street, postalcode, city and country missing", 404);
            }
            const address = await this.customerRepository.createAddress(_id, street, postalcode, city, country);
            return formatData(address);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error adding address", 500);
            }
        }
    }

    getCustomer = async (_id) => {
        try {
            if (!_id) {
                throw new DefinedError("customer id missing", 404);
            }
            const customerDetails = await this.customerRepository.findCustomerById(_id);
            return formatData(customerDetails);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error getting customer", 500);
            }
        }
    }

    getShoppingDetails = async (_id) => {
        try {
            if (!_id) {
                throw new DefinedError("customer id missing", 404);
            }
            const customerDetails = await this.customerRepository.findCustomer(_id);
            return formatData(customerDetails);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error getting shopping details", 500);
            }
        }
    }

    getWishlist = async (_id) => {
        try {
            if (!_id) {
                throw new DefinedError("customer id missing", 404);
            }
            const customerwishlist = await this.customerRepository.findCustomerById(_id);
            return formatData(customerwishlist.wishlist);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error getting wishlist", 500);
            }
        }
    }

    addToWishlist = async (_id, product) => {
        try {
            if (!_id || !product) {
                throw new DefinedError("customer id and product missing", 404);
            }
            const wishlist = await this.customerRepository.addToWishlist(_id, product);
            return formatData(wishlist);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error adding to wishlist", 500);
            }
        }
    }

    manageCart = async (_id, product, quantity, isRemove) => {
        try {
            if (!_id || !product) {
                throw new DefinedError("customer id, product and quantity missing", 404);
            }
            const cart = await this.customerRepository.addCartItems(_id, product, quantity, isRemove);
            return formatData(cart);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error managing cart", 500);
            }
        }
    }

    manageOrder = async (_id, order) => {
        try {
            if (!_id || !order) {
                throw new DefinedError("customer id and order missing", 404);
            }
            const customerOrder = await this.customerRepository.addOrderToProfile(_id, order);
            return formatData(customerOrder);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err
            }
            else {
                throw new DefinedError("Error managing order", 500);
            }
        }
    }

    subscribeEvents = async (payload) => {
        payload = await JSON.parse(payload);
        const { event, data } = payload;
        console.log("Event received", event);
        console.log("Data received", data);
        const { _id, product, order, quantity } = data;
        switch (event) {
            case 'ADD_TO_CART':
                return await this.manageCart(_id, product, quantity, false);
            case 'REMOVE_FROM_CART':
                return await this.manageCart(_id, product, quantity, true);
            case 'ADD_TO_ORDER':
                return await this.manageOrder(_id, order);
            case 'ADD_TO_WISHLIST':
                return await this.addToWishlist(_id, product);
            case 'REMOVE_FROM_WISHLIST':
                return await this.addToWishlist(_id, product);
            default:
                return formatData({ "message": "Event not found" });
        }
    }

}

module.exports = { CustomerService }
