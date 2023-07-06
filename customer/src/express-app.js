const express = require('express');
const cors = require('cors');
const customer = require('./api/customer');
const { createChannel } = require('./utils/index')

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());


    const channel = await createChannel()
    customer(app, channel);

}