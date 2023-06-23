const express = require('express');
const app = express();
const cors = require('cors');
const { port } = require('./config/index');
const { connect } = require('./database/connection')
const shoppingRoutes = require('./routes/shopping');
const { ShoppingService } = require('./services/shopping-service');

app.use(express.json());
app.use(cors());
app.use('/', shoppingRoutes);

const service = new ShoppingService();
app.use('/shopping/app-events', async (req, res) => {
    const { payload } = req.body;
    console.log(payload);
    await service.subscribeEvent(payload);
    res.json(payload);
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