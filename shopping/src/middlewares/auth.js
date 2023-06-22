const { verifyToken } = require('../utils/index')

const validateToken = async (req, res, next) => {
    const isAuthorized = await verifyToken(req)
    if (isAuthorized) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
}

module.exports = { validateToken }