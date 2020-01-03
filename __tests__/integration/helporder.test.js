import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('HelpOrder', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should store HelpOrder question', async () => {
    const { id: student_id } = await factory.create('Student');

    const response = await request(app)
      .post(`/students/${student_id}/help-orders`)
      .send({
        question: 'Olá, poderia me ajudar?',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should store HelpOrder answer', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const { id: helporder_id, student_id } = await factory.create('HelpOrder');

    const response = await request(app)
      .post(`/help-orders/${helporder_id}/answer`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ id: student_id, answer: 'Mas é claro!' });

    expect(response.status).toBe(200);
  });

  it('should list helporders', async () => {
    const { id: student_id } = await factory.create('Student');

    await factory.create('HelpOrder', { student_id });
    await factory.create('HelpOrder', { student_id });

    const response = await request(app).get(`/help-orders`);

    expect(response.body[0]).toHaveProperty('question');
    expect(response.body[1]).toHaveProperty('question');
  });
});
