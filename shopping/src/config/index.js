const dotEnv = require('dotenv');

dotEnv.config();
module.exports = {
    port: process.env.PORT,
    dbUrl: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    QUEUE_NAME: "shopping_queue",
    EXCHANGE_NAME: 'OnlineShop',
    SHOPPING_BINDING_KEY: 'shopping_service',
    CUSTOMER_BINDING_KEY: 'customer_service',
}
