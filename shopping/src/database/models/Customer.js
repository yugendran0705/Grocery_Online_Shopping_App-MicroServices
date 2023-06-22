const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    address: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Customer', customerSchema);