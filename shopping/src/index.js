const express = require('express');
const app = express();
const { port } = require('./config/index');
const { connect } = require('./database/connection')
const shoppingRoutes = require('./routes/shopping');
const { ShoppingService } = require('./services/shopping-service');

app.use(express.json());
app.use('/', shoppingRoutes);

const service = new ShoppingService();
app.use('/app-events', async (req, res) => {
    const { payload } = req.body;
    service.subscribeEvents(payload);
    res.status(200).json(payload);
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