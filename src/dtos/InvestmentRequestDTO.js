const { sanitizeInput, isValidCurrency, isValidDate } = require('../utils');

class InvestmentRequestDTO {
    constructor({ currency, amount, projectedValueDate }) {
        // Sanitize fields
        this.currency = sanitizeInput(currency);
        this.amount = sanitizeInput(amount);
        this.projectedValueDate = sanitizeInput(projectedValueDate);

        if (!isValidCurrency(this.currency)) {
            const err = new Error('Invalid currency. Must be USD, EUR, or GBP.');
            err.name = 'ValidationError';
            throw err;
        }

        const numericAmount = parseFloat(this.amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            const err = new Error('Initial investment must be a positive number.');
            err.name = 'ValidationError';
            throw err;
        }

        if (!isValidDate(this.projectedValueDate)) {
            const err = new Error('Invalid date format (expected YYYY-MM-DD).');
            err.name = 'ValidationError';
            throw err;
        }

        // Store numeric conversions if desired
        this.amount = numericAmount;
    }
}

module.exports = {
    InvestmentRequestDTO
};
