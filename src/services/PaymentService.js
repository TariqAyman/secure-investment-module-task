const { PaymentStatus } = require('../config/paymentStatus');
const { logger } = require('../utils/logger');

let PAYMENT_DB = []; // each record: { id, status, attempts, investmentDetails }

class PaymentService {
    /**
     * Creates a new payment record in "pending" status
     */
    static createPayment(investmentDetails) {
        const id = 'pay_' + Math.random().toString(36).slice(2, 10);
        PAYMENT_DB.push({
            id,
            status: PaymentStatus.PENDING,
            attempts: 0,
            investmentDetails
        });
        return id;
    }

    /**
     * Retrieves the payment status by ID
     */
    static getPaymentStatus(id) {
        const payment = PAYMENT_DB.find(p => p.id === id);
        if (!payment) return null;
        return payment.status;
    }

    /**
     * Internal method to simulate actual payment processing with random success/fail
     */
    static async processPayment(paymentRecord) {
        const success = Math.random() > 0.3; // 70% chance to succeed
        paymentRecord.status = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
        paymentRecord.attempts += 1;
    }

    /**
     * Retry a failed payment up to 3 times with exponential backoff
     */
    static async retryPayment(paymentId) {
        const paymentRecord = PAYMENT_DB.find(p => p.id === paymentId);
        if (!paymentRecord) return { error: 'Payment not found' };

        // If it's already completed, return immediately
        if (paymentRecord.status === PaymentStatus.COMPLETED) {
            return { status: PaymentStatus.COMPLETED };
        }

        let attempt = 1;
        while (attempt <= 3 && paymentRecord.status !== PaymentStatus.COMPLETED) {
            logger.info(`Payment [${paymentId}] - Attempt #${attempt}`);

            await this.processPayment(paymentRecord);

            if (paymentRecord.status === PaymentStatus.COMPLETED) {
                logger.info(`Payment [${paymentId}] succeeded on attempt #${attempt}`);
                break;
            }

            // If failed and we still have attempts left, wait with exponential backoff
            if (paymentRecord.status === PaymentStatus.COMPLETED && attempt < 3) {
                const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, etc.
                logger.info(`Payment [${paymentId}] failed. Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            }

            attempt++;
        }

        logger.info(`Payment [${paymentId}] final status: ${paymentRecord.status}`);
        return { status: paymentRecord.status };
    }
}

if (process.env.NODE_ENV === 'test') {
    PaymentService._clearTestData = function () {
        PAYMENT_DB = [];
    };
    PaymentService._getRecordById = function (id) {
        return PAYMENT_DB.find(p => p.id === id);
    };
}

module.exports = {
    PaymentService
};