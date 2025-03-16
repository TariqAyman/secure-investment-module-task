/*****************************************************
 * tests/paymentController.int.test.js
 * ---------------------------------
 * Integration tests for the PaymentController,
 * focusing on:
 *   - POST /payments
 *   - GET /payments/:id
 *   - POST /payments/:id/retry
 *****************************************************/
const request = require('supertest');
const { app } = require('../../src/server');
const { PaymentStatus } = require('../../src/config/paymentStatus');

describe('PaymentController Integration Tests', () => {
    let token;

    beforeAll(async () => {
        // Get a valid token from /login
        const loginRes = await request(app)
            .post('/api/login')
            .send({ username: 'sarah', password: 'test' });

        token = loginRes.body.token;
    });

    it('should fail to create payment if no token provided', async () => {
        const res = await request(app).post('/api/payments').send({});
        expect(res.status).toBe(401);
    });

    it('should create a new payment in pending status', async () => {
        const res = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${token}`)
            .send({ comment: 'New Payment' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('paymentId');
        expect(res.body.status).toBe(PaymentStatus.PENDING);

        // We'll use this ID in subsequent tests if needed
    });

    it('should return 404 if payment not found', async () => {
        const res = await request(app)
            .get('/api/payments/not_a_real_id')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should retrieve existing payment status', async () => {
        // create a payment
        const createRes = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${token}`)
            .send({ comment: 'Check Payment Status' });
        const { paymentId } = createRes.body;

        // get the payment
        const getRes = await request(app)
            .get(`/api/payments/${paymentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body.status).toBe(PaymentStatus.PENDING);
    });

    it('should retry a payment up to 3 times', async () => {
        // create a payment
        const createRes = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${token}`)
            .send({ comment: 'Retry Payment' });
        const { paymentId } = createRes.body;

        // retry the payment
        const retryRes = await request(app)
            .post(`/api/payments/${paymentId}/retry`)
            .set('Authorization', `Bearer ${token}`);
        expect(retryRes.status).toBe(200);
        // finalStatus could be 'completed' or 'failed'
        expect([PaymentStatus.COMPLETED, PaymentStatus.FAILED])
            .toContain(retryRes.body.finalStatus);
    });
});
