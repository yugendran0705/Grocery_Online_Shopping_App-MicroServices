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
    cart: [
        {
            product: {
                _id: { type: String, require: true },
                name: { type: String, require: true },
                price: { type: Number, require: true },
                banner: { type: String, require: true },
            },
            unit: { type: Number, require: true },
        }
    ],
    orders: [
        {
            _id: { type: String, require: true },
            amount: { type: Number, require: true },
            date: { type: Date, default: Date.now() },
        }
    ],
    wishlist: [
        {
            _id: { type: String, require: true },
            name: { type: String, require: true },
            desc: { type: String },
            banner: { type: String, require: true },
            available: { type: Boolean, require: true },
            price: { type: Number, require: true },
        }
    ]
});

module.exports = mongoose.model('Customer', customerSchema);