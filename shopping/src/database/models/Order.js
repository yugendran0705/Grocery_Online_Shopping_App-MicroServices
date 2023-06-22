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
                type: Schema.Types.ObjectId, ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Order', orderSchema);