const dotEnv = require('dotenv');

dotEnv.config();
module.exports = {
    port: process.env.PORT,
    dbUrl: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
}
