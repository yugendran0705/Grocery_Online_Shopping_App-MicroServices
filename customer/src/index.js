const express = require('express');
const app = express();
const { port } = require('./config/index');
const { connect } = require('./database/connection');
const customerRoutes = require('./routes/customer');
const { CustomerService } = require('./services/customer-service');

app.use(express.json());
app.use('/', customerRoutes);

const service = new CustomerService();
app.use('/app-events', async (req, res) => {
    const { payload } = req.body;
    service.subscribeEvents(payload);
    console.log("Event received");
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