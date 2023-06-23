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
                _id: { type: String, required: true },
                name: { type: String, required: true },
                desc: { type: String, required: true },
                type: { type: String, required: true },
                unit: { type: Number, required: true },
                price: { type: Number, required: true },
                banner: { type: String, required: true },
                available: { type: Boolean, required: true },
                suplier: { type: String, required: true }
            },
            unit: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);