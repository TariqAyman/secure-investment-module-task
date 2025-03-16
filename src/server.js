/*****************************************************
 * server.js
 * ---------------------------------
 * Demo of a secure multi-currency investment module.
 * ---------------------------------
 * Main entry point: initializes Express,
 * loads middleware and controllers, starts the app.
 *****************************************************/
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middleware/authMiddleware');
const { authRouter } = require('./controllers/authController');
const { investmentRouter } = require('./controllers/investmentController');
const { paymentRouter } = require('./controllers/paymentController');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/login', authRouter);
app.use('/api/invest', authenticateToken, investmentRouter);
app.use('/api/payments', authenticateToken, paymentRouter);

// Export the app for testing
module.exports = { app };

// If you're running locally, you can still do:
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Secure Investment Module running on port http:://127.0.0.1:${PORT}`);
    });
}