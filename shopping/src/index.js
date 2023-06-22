const express = require('express');
const app = express();
const { port } = require('./config/index');
const { connect } = require('./database/connection');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customer');
const shoppingRoutes = require('./routes/shopping');

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/shopping', shoppingRoutes);

app.listen(port, async () => {
    console.log(`Server started on port ${port}`);
    if (await connect()) {
        console.log('Database connected');
    }
    else {
        console.log('Database connection failed');
    }
});