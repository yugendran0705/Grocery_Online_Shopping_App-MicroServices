const express = require('express');
const { port } = require('./config/index');
const { connect } = require('./database/connection');
const expressApp = require('./express-app');
const { createChannel } = require('./utils/index')

const StartServer = async () => {

    const app = express();// express app instance created

    await connect();

    await expressApp(app);


    app.listen(port, () => {
        console.log(`listening to port ${port}`);
    })


}

StartServer();