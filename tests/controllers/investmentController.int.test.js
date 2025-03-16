/*****************************************************
 * tests/investmentController.int.test.js
 * ---------------------------------
 * Integration tests for the InvestmentController,
 * focusing on POST /invest
 *****************************************************/
const request = require('supertest');
const { app } = require('../../src/server');
const { PaymentStatus } = require('../../src/config/paymentStatus');

describe('InvestmentController Integration Tests', () => {
    let token;

    beforeAll(async () => {
        // Obtain a valid JWT by logging in
        const loginRes = await request(app)
            .post('/api/login')
            .send({ username: 'sarah', password: 'test' });

        token = loginRes.body.token;
    });

    it('should fail if no JWT token is provided', async () => {
        const res = await request(app)
            .post('/api/invest')
            .send({ currency: 'EUR', amount: 1000, projectedValueDate: '2024-12-31' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });

    it('should fail if currency is invalid', async () => {
        const res = await request(app)
            .post('/api/invest')
            .set('Authorization', `Bearer ${token}`)
            .send({ currency: 'XYZ', amount: 1000, projectedValueDate: '2024-12-31' });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Invalid currency');
    });

    it('should fail if amount is <= 0', async () => {
        const res = await request(app)
            .post('/api/invest')
            .set('Authorization', `Bearer ${token}`)
            .send({ currency: 'EUR', amount: -100, projectedValueDate: '2024-12-31' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Initial investment must be a positive number.');
    });

    it('should fail if date format is invalid', async () => {
        const res = await request(app)
            .post('/api/invest')
            .set('Authorization', `Bearer ${token}`)
            .send({ currency: 'EUR', amount: 1000, projectedValueDate: '31-12-2024' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid date format (expected YYYY-MM-DD).');
    });

    it('should succeed with valid data and return transaction info', async () => {
        const res = await request(app)
            .post('/api/invest')
            .set('Authorization', `Bearer ${token}`)
            .send({ currency: 'EUR', amount: 1000, projectedValueDate: '2024-12-31' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('paymentId');
        expect(res.body).toHaveProperty('roiPercentage');
        expect(res.body.status).toBe(PaymentStatus.PENDING);
    });
});
