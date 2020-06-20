const request = require('supertest');

const app = require('..');

describe('POST /api/login', () => {
  it('should respond with a token', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'abc@example.com',
      password: '1234',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail', () => {
    expect(true).toBe(false);
  });
});
