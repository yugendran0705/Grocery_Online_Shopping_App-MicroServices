const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalcode: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Address', addressSchema);