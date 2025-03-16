const Decimal = require('decimal.js');

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    // Hardcoded exchange rates for demonstration
    EXCHANGE_RATES: {
        'USD': new Decimal(1),
        'EUR': new Decimal(1.08),
        'GBP': new Decimal(1.27),
    },
    SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP'],
    PAYMENT: {
        MAX_ATTEMPTS: 3,
        INITIAL_DELAY: 1000
    }
}; 