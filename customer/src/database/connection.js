const mongoose = require('mongoose');
const { dbUrl } = require('../config');

const connect = async () => {
    try {
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connected to database');
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