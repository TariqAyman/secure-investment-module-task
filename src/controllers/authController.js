const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../models/userModel');
const { JWT_SECRET } = require('../utils'); 
const { logger } = require('../utils/logger');

const authRouter = express.Router();

// POST /login
authRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Retrieve user from a mock DB or a real DB
        const user = getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // For demonstration, the user password is "test"
        if (password !== 'test') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // KYC/Verification check
        if (!user.verified) {
            return res.status(403).json({ error: 'User is not verified (KYC failed)' });
        }

        // Issue JWT
        const tokenPayload = { userId: user.id, username: user.username };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token });
    } catch (err) {
        logger.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = {
    authRouter
};
