const jwt = require('jsonwebtoken')
const { env: { jwtPrivateKey } } = process


module.exports = function (req, res, next) {
    debugger
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided')

    try {
        const { id } = jwt.verify(token, jwtPrivateKey);

        req.id = id;

        next();

    } catch (ex) {

        res.status(400).send('Invalid token.')

    }
}