import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('Checkin', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should store checkin', async () => {
    const { id } = await factory.create('Student');

    const response = await request(app)
      .post('/checkins')
      .send({ student_id: id });

    expect(response.body).toHaveProperty('newCheckin');
    expect(response.body).toHaveProperty('checkin_count');
  });
});
