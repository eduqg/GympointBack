import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('Student', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should store student', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const student = await factory.attrs('Student');

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send(student);

    expect(response.body).toHaveProperty('id');
  });

  it('should update student', async () => {
    const { email: emailSession } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email: emailSession, password: '123456' });

    const { id, email, idade, peso, altura } = await factory.create('Student', {
      name: 'João',
    });

    const response = await request(app)
      .put(`/students/${id}`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        name: 'Joana',
        email,
        idade,
        peso,
        altura,
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should list students', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    await factory.create('Student', { email: 'diego@gympoint.com' });
    await factory.create('Student', { email: 'eduardo@gympoint.com' });

    const response = await request(app)
      .get(`/students`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[1]).toHaveProperty('id');
  });

  it('should destroy student', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id } = await factory.create('Student');

    const response = await request(app)
      .delete(`/students`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .set('id', `${id}`);

    expect(response.status).toBe(200);
  });
});
