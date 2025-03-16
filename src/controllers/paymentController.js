const express = require('express');
const { PaymentService } = require('../services/paymentService');
const { logger } = require('../utils/logger');

const paymentRouter = express.Router();

/**
 * POST /payments
 * Creates a new payment with 'pending' status and returns the payment ID.
 */
paymentRouter.post('/', (req, res) => {
    try {
        // Optionally, parse something from req.body if you like:
        // e.g., const { amount, currency } = req.body;

        const paymentId = PaymentService.createPayment({
            // userId, amount, currency, or any other relevant details.
            comment: 'Example Payment Creation'
        });

        return res.status(201).json({
            paymentId,
            status: 'pending'
        });
    } catch (error) {
        logger.error('Error creating payment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /payments/:id - retrieve payment status
paymentRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const paymentStatus = PaymentService.getPaymentStatus(id);

    if (paymentStatus === null) {
        return res.status(404).json({ error: 'Payment not found' });
    }
    return res.json({ paymentId: id, status: paymentStatus });
});

// POST /payments/:id/retry - tries up to 3 attempts
paymentRouter.post('/:id/retry', async (req, res) => {
    const { id } = req.params;
    const result = await PaymentService.retryPayment(id);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.json({ paymentId: id, finalStatus: result.status });
});

module.exports = {
    paymentRouter
};
