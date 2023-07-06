const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DefinedError } = require('./error-handler');
const { jwtSecret, MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME } = require('../config/index');
const ampqlib = require('amqplib');

generateSalt = async () => {
    return await bcrypt.genSalt(10);
}

generatePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}

validatePassword = async (enteredpassword, savedpassword, salt) => {
    return (await generatePassword(enteredpassword, salt)) === savedpassword;
}

generateToken = async (payload) => {
    return jwt.sign(payload, jwtSecret);
}

verifyToken = async (req) => {
    const signature = req.get("Authorization");
    const payload = jwt.verify(signature.split(" ")[1], jwtSecret);
    req.user = payload;
    return true;
}

formatData = (data) => {
    if (data) {
        return data;
    }
    else {
        return DefinedError("Data not found", 404);
    }
}

createChannel = async () => {
    try {
        const connection = await ampqlib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
        console.log('channel created')
        return channel
    }
    catch (err) {
        throw err;
    }
}

publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message))
        console.log('message published' + message)
    }
    catch (err) {
        throw err;
    }
}

subscribeMessage = async (channel, service, binding_key) => {
    const appQueue = await channel.assertQueue(QUEUE_NAME)

    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key)

    channel.consume(appQueue.queue, data => {
        console.log('recieved data')
        console.log(data.content.toString())
        channel.ack(data)
    })
}

module.exports = {
    generateSalt,
    generatePassword,
    validatePassword,
    generateToken,
    verifyToken,
    formatData,
    createChannel,
    publishMessage,
    subscribeMessage
}

