import request from 'supertest';
import { app } from '../config/app';

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      })
      .expect(200);
  });
});
