const Decimal = require('decimal.js');
const { EXCHANGE_RATES } = require('../config/constants');

class TransactionService {
    static convertToUSD(amount, fromCurrency) {
        const rate = EXCHANGE_RATES[fromCurrency.toUpperCase()];
        if (!rate) throw new Error(`Unsupported currency: ${fromCurrency}`);
        return new Decimal(amount).mul(rate);
    }

    static calculateROI(initialUSD, projectedUSD) {
        const roi = new Decimal(projectedUSD)
            .minus(new Decimal(initialUSD))
            .div(new Decimal(initialUSD))
            .mul(100);
        return roi.toFixed(2);
    }
}

module.exports = {
    TransactionService
};