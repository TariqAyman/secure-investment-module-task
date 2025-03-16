/*****************************************************
 * tests/authController.int.test.js
 * ---------------------------------
 * Integration tests for the AuthController,
 * focusing on POST /login behavior.
 *****************************************************/
const request = require('supertest');
const { app } = require('../../src/server');

describe('AuthController Integration Tests', () => {
    it('should return 400 if username or password is missing', async () => {
        const response = await request(app)
            .post('/api/login') // Route from authController
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Username and password are required' });
    });

    it('should return 401 if user not found or invalid password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'nonexistent', password: 'test' });
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return a JWT token if valid credentials are provided', async () => {
        // Assuming we have a user named "sarah" with password "test" in userModel
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'sarah', password: 'test' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
    });

    it('should return 403 if user is not verified (KYC failed)', async () => {
        // Suppose you have an unverified user in your USERS_DB
        // e.g. { id: 'user-2', username: 'john', verified: false }
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'john', password: 'test' });
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('User is not verified (KYC failed)');
    });
});
