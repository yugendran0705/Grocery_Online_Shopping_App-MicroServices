const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tnxId: {
        type: String,
        required: true
    },
    items: [
        {
            product: {
                name: String,
                desc: String,
                banner: String,
                type: String,
                unit: Number,
                price: Number,
                available: Boolean,
                suplier: String
            },
            unit: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Order', orderSchema);