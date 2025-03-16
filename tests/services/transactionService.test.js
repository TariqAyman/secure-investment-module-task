/*****************************************************
 * tests/transactionService.test.js
 *****************************************************/
const { TransactionService } = require('../../src/services/transactionService');
const Decimal = require('decimal.js');

describe('TransactionService Tests', () => {
    describe('convertToUSD', () => {
        it('should convert EUR to USD using 1.08 rate', () => {
            const amountEUR = 100;
            const result = TransactionService.convertToUSD(amountEUR, 'EUR');
            expect(result.toString()).toBe(new Decimal(100).mul(1.08).toString());
        });

        it('should convert GBP to USD using 1.27 rate', () => {
            const amountGBP = 100;
            const result = TransactionService.convertToUSD(amountGBP, 'GBP');
            expect(result.toString()).toBe(new Decimal(100).mul(1.27).toString());
        });

        it('should return the same amount for USD', () => {
            const amountUSD = 100;
            const result = TransactionService.convertToUSD(amountUSD, 'USD');
            expect(result.toString()).toBe(new Decimal(100).toString());
        });

        it('should throw error for unsupported currency', () => {
            expect(() => {
                TransactionService.convertToUSD(100, 'JPY');
            }).toThrow('Unsupported currency: JPY');
        });
    });

    describe('calculateROI', () => {
        it('should calculate positive ROI correctly', () => {
            const initialUSD = new Decimal(1000);
            const projectedUSD = new Decimal(1200);
            const roi = TransactionService.calculateROI(initialUSD, projectedUSD);
            // ROI = ((1200 - 1000) / 1000) * 100 = 20%
            expect(roi).toBe('20.00');
        });

        it('should calculate negative ROI correctly', () => {
            const initialUSD = new Decimal(1000);
            const projectedUSD = new Decimal(900);
            const roi = TransactionService.calculateROI(initialUSD, projectedUSD);
            // ROI = ((900 - 1000) / 1000) * 100 = -10%
            expect(roi).toBe('-10.00');
        });
    });
});
