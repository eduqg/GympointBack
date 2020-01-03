import request from 'supertest';
import { addDays } from 'date-fns';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('Registration', () => {
  beforeEach(async () => {
    await truncate();
    jest.setTimeout(20000);
  });

  it('should store registration', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id: student_id } = await factory.create('Student');
    const { id: plan_id } = await factory.create('Plan');

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        plan_id,
        student_id,
        start_date: new Date(),
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should update registration', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id, student_id, plan_id } = await factory.create('Registration');

    const response = await request(app)
      .put(`/registrations/${id}`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        start_date: addDays(new Date(), 3),
        student_id,
        plan_id,
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should list registrations', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id: id1 } = await factory.create('Student', {
      email: 'eduardo@gympoint.com',
    });
    const { id: id2 } = await factory.create('Student', {
      email: 'diego@gympoint.com',
    });

    const { id: plan_id } = await factory.create('Plan');

    await factory.create('Registration', {
      student_id: id1,
      plan_id,
      start_date: new Date(),
    });

    await factory.create('Registration', {
      student_id: id2,
      plan_id,
      start_date: new Date(),
    });

    const response = await request(app)
      .get(`/registrations`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[1]).toHaveProperty('id');
  });

  it('should destroy registration', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id } = await factory.create('Registration');

    const response = await request(app)
      .delete(`/registrations/${id}`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(response.status).toBe(200);
  });
});
