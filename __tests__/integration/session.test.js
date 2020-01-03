import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should store session and return token jwt', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    expect(typeof session.body.token).toBe('string');
  });

  it('should have email on requisiton', async () => {
    await factory.create('User', {
      password: '123456',
    });

    const session = await request(app)
      .post('/sessions')
      .send({ password: '123456' });

    expect(session.status).toBe(400);
  });

  it('should not create session if email is not registered', async () => {
    const session = await request(app)
      .post('/sessions')
      .send({ email: 'renata@meditana.com', password: '123456' });

    expect(session.status).toBe(401);
  });

  it('should check if password are not correct', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '1234567' });

    expect(session.status).toBe(401);
  });
});
