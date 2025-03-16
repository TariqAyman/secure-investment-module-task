/*****************************************************
 * middleware/authMiddleware.js
 * ---------------------------------
 * Express middleware that verifies JWT tokens 
 * before allowing access to protected endpoints.
 *****************************************************/
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // attach user payload to request
        next();
    });
}

module.exports = {
    authenticateToken
};