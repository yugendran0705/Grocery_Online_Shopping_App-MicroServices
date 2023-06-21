const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/customer', proxy('http://localhost:8000'));
app.use('/', proxy('http://localhost:8001'));
app.use('/shopping', proxy('http://localhost:8002'));

app.listen(8003, () => {
    console.log('Server is running on port 8003');
});