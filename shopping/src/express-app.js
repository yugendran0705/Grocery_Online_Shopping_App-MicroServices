const express = require('express');
const cors = require('cors');
const shopping = require('./api/shopping');
const { createChannel } = require('./utils/index')

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());

    const channel = await createChannel()

    shopping(app, channel);

}