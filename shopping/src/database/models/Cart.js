const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    customerId: {
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

module.exports = mongoose.model('Cart', cartSchema);