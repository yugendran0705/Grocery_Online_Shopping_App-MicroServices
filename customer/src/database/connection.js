const mongoose = require('mongoose');
const { dbUrl } = require('../config');

const connect = async () => {
    try {
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        return true;
    }
    catch (err) {
        console.log(`Error: ${err}`)
        return false;
    }
}

module.exports = {
    connect
}