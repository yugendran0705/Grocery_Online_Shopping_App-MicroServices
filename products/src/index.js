const express = require('express');
const app = express();
const { port } = require('./config/index');
const { connect } = require('./database/connection');
const productRoutes = require('./routes/products');

app.use(express.json());
app.use('/', productRoutes);
app.use('/app-events', async (req, res, next) => {
    const { payload } = req.body;
    console.log("Product Received event");
    res.status(200).json(payload);
    return;
});

app.listen(port, async () => {
    console.log(`Server started on port ${port}`);
    if (await connect()) {
        console.log('Database connected');
    }
    else {
        console.log('Database connection failed');
    }
});