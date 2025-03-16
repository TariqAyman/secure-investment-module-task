/*****************************************************
 * tests/paymentService.test.js
 *****************************************************/
const { PaymentService } = require('../../src/services/paymentService');
const { PaymentStatus } = require('../../src/config/paymentStatus');

describe('PaymentService Tests', () => {
    afterEach(() => {
        // Clear the in-memory PAYMENT_DB after each test
        // so tests don't affect each other
        const service = PaymentService;
        service._clearTestData(); // We'll add a helper method, see below
    });

    it('should create a new payment in PENDING status', () => {
        const paymentId = PaymentService.createPayment({ comment: 'Test Payment' });
        expect(paymentId).toMatch(/^pay_/);

        const status = PaymentService.getPaymentStatus(paymentId);
        expect(status).toBe(PaymentStatus.PENDING);
    });

    it('should return null for non-existing payment status', () => {
        const status = PaymentService.getPaymentStatus('non_existent');
        expect(status).toBeNull();
    });

    describe('processPayment', () => {
        it('should randomly set payment to COMPLETED or FAILED', async () => {
            const paymentId = PaymentService.createPayment({ comment: 'Process test' });
            const paymentRecord = PaymentService._getRecordById(paymentId); // custom helper

            await PaymentService.processPayment(paymentRecord);
            // The record status should be either COMPLETED or FAILED
            expect([PaymentStatus.COMPLETED, PaymentStatus.FAILED]).toContain(paymentRecord.status);

            // The attempts should increment
            expect(paymentRecord.attempts).toBe(1);
        });
    });

    describe('retryPayment', () => {
        it('should eventually set payment to COMPLETED or remain FAILED after 3 attempts', async () => {
            const paymentId = PaymentService.createPayment({ comment: 'Retry test' });
            const result = await PaymentService.retryPayment(paymentId);

            // result.status is final status. If the random fails happen all 3 times, 
            // it can remain FAILED, otherwise COMPLETED
            expect([PaymentStatus.COMPLETED, PaymentStatus.FAILED]).toContain(result.status);

            // If completed, we can check attempts are between 1 and 3.
            // If failed, it must have tried 3 times.
            const paymentRecord = PaymentService._getRecordById(paymentId);
            if (paymentRecord.status === PaymentStatus.COMPLETED) {
                expect(paymentRecord.attempts).toBeLessThanOrEqual(3);
            } else {
                expect(paymentRecord.attempts).toBe(3);
            }
        });

        it('should handle already-completed payment gracefully', async () => {
            const paymentId = PaymentService.createPayment({ comment: 'Already completed test' });
            const paymentRecord = PaymentService._getRecordById(paymentId);
            paymentRecord.status = PaymentStatus.COMPLETED;

            const result = await PaymentService.retryPayment(paymentId);
            expect(result.status).toBe(PaymentStatus.COMPLETED);

            // It should not increment attempts if already completed
            expect(paymentRecord.attempts).toBe(0);
        });
    });
});
