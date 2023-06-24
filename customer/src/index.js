const express = require('express');
const app = express();
const cors = require('cors');
const { port } = require('./config/index');
const { connect } = require('./database/connection');
const customerRoutes = require('./routes/customer');
const { CustomerService } = require('./services/customer-service');

app.use(express.json());
app.use(cors());
app.use('/', customerRoutes);

const service = new CustomerService();
app.use('/customer/app-events', async (req, res) => {
    const { payload } = req.body;
    await service.subscribeEvents(payload);
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