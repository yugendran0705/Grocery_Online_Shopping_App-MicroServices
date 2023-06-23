const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DefinedError } = require('../utils/error-handler');
const { jwtSecret } = require('../config/index');

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
    console.log(signature);
    const payload = jwt.verify(signature.split(" ")[1], jwtSecret);
    req.user = payload;
    return true;
}

formatData = (data) => {
    if (data) {
        return data;
    }
    else {
        throw new DefinedError("Data not found", 404);
    }
}

module.exports = {
    generateSalt,
    generatePassword,
    validatePassword,
    generateToken,
    verifyToken,
    formatData
}

