const express = require('express');
const { port } = require('./config/index');
const { connect } = require('./database/connection')
const expressApp = require('./express-app');



const StartServer = async () => {

    const app = express();

    await connect();

    await expressApp(app);

    app.listen(port, () => {
        console.log(`listening to port ${port}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })

}

StartServer();