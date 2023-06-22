const { CustomerRepository } = require('../database/repository/customer-repository')
const { generateSalt, generatePassword, generateToken, formatData, validatePassword } = require('../utils');
const { DefinedError } = require('../utils/error-handler');

class CustomerService {
    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    signIn = async (email, password) => {
        try {
            const customer = await this.customerRepository.findCustomer(email);
            if (customer) {
                const validPassword = await validatePassword(password, customer.password, customer.salt);
                if (validPassword) {
                    const token = await generateToken({ email: customer.email, _id: customer._id });
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
            const customerwishlist = await this.customerRepository.findCustomer(_id);
            return formatData(customerwishlist);
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
        const { event, data } = payload;
        const { _id, product, order, qty } = data;
        switch (event) {
            case 'ADD_TO_CART':
                return await this.manageCart(_id, product, qty, false);
            case 'REMOVE_FROM_CART':
                return await this.manageCart(_id, product, qty, true);
            case 'ADD_TO_ORDER':
                return await this.manageOrder(_id, order);
            case 'ADD_TO_WISHLIST':
                return await this.addToWishlist(_id, product);
            case 'REMOVE_FROM_WISHLIST':
                return await this.addToWishlist(_id, product);
            default:
                return formatData(null);
        }
    }

}

module.exports = { CustomerService }
