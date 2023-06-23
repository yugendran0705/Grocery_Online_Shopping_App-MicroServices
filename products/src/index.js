const express = require('express');
const app = express();
const cors = require('cors');
const { port } = require('./config/index');
const { connect } = require('./database/connection');
const productRoutes = require('./routes/products');

app.use(express.json());
app.use(cors());
app.use('/', productRoutes);


app.listen(port, async () => {
    console.log(`Server started on port ${port}`);
    if (await connect()) {
        console.log('Database connected');
    }
    else {
        console.log('Database connection failed');
    }
});