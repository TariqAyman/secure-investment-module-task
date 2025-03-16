const express = require('express');
const { TransactionService } = require('../services/transactionService');
const { PaymentService } = require('../services/paymentService');
const { hashSensitiveData } = require('../utils');
const { transactionLogs, logger } = require('../utils/logger'); // or a DB
const { InvestmentRequestDTO } = require('../dtos/InvestmentRequestDTO');
const { TransactionResponseDTO } = require('../dtos/TransactionResponseDTO');
const { PaymentStatus } = require('../config/paymentStatus');

const investmentRouter = express.Router();

/**
 * POST /invest
 * Assumes that authenticateToken middleware is already applied at the router level.
 */
investmentRouter.post('/', async (req, res) => {
    try {
        // Build and validate the incoming request
        const investReq = new InvestmentRequestDTO(req.body);

        // Convert to USD
        const usdValue = TransactionService.convertToUSD(investReq.amount, investReq.currency);

        // For demonstration, we assume 5% growth in 12 months
        const projectedUSD = usdValue.mul(1.05);
        const roiPercentage = TransactionService.calculateROI(usdValue, projectedUSD);

        // Create a payment record in 'pending' status
        const paymentId = PaymentService.createPayment({
            userId: req.user.userId,
            currency: investReq.currency,
            amount: investReq.amount,
            convertedUSD: usdValue.toFixed(2),
            projectedUSD: projectedUSD.toFixed(2),
            projectedValueDate: investReq.projectedValueDate
        });

        // Hash userId before returning
        const hashedUserId = await hashSensitiveData(req.user.userId);

        // Build response
        const responseDTO = new TransactionResponseDTO({
            paymentId,
            hashedUserId,
            originalCurrency: investReq.currency,
            initialInvestment: investReq.amount,
            convertedUSD: usdValue.toFixed(2),
            projectedValueDate: investReq.projectedValueDate,
            projectedUSD: projectedUSD.toFixed(2),
            roiPercentage,
            status: PaymentStatus.PENDING
        });

        // Log it (in a real app, store in DB)
        transactionLogs.push(responseDTO);

        return res.status(200).json(responseDTO);
    } catch (err) {
        // Distinguish known validation errors vs. unknown errors
        if (err.name === 'ValidationError') {
            // known invalid input → 400
            return res.status(400).json({ error: err.message });
        } else {
            // unknown/unhandled → 500
            logger.error('Error in /invest:', err);
            return res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
});

module.exports = {
    investmentRouter
};