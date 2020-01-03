import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('Plan', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should store plan', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        title: 'Super Smart',
        duration: 10,
        price: 89.9,
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should update plan', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id } = await factory.create('Plan', {
      price: 1,
    });

    const response = await request(app)
      .put(`/plans/${id}`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        title: 'Super Smart',
        duration: 11,
        price: 100,
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should list plans', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    await factory.create('Plan', { title: 'Super' });
    await factory.create('Plan', { title: 'Ultra' });

    const response = await request(app)
      .get(`/plans`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(response.body[0]).toHaveProperty('duration');
    expect(response.body[1]).toHaveProperty('duration');
  });

  it('should destroy plan', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id } = await factory.create('Plan');

    const response = await request(app)
      .delete(`/plans`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .set('id', `${id}`);

    expect(response.status).toBe(200);
  });
});
