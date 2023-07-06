const express = require("express");
const cors = require("cors");
const products = require("./api/products");

const { createChannel } = require("./utils/index");

module.exports = async (app) => {
    app.use(express.json());
    app.use(cors());

    const channel = await createChannel();
    products(app, channel);
};