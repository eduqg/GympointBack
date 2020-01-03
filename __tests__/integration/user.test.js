import request from 'supertest';
import bcrypt from 'bcryptjs';
import faker from 'faker';

import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  // Encrypt password
  it('should encrypt user password when new user are created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  // Create user
  it('should be able to register one user', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicate email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);
    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not register user with password with less than 6 characteres', async () => {
    const user = await factory.attrs('User', {
      password: '12345',
    });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not register user with password without name', async () => {
    const { email, password } = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ email, password });

    expect(response.status).toBe(400);
  });

  it('should not register user with password without email', async () => {
    const { name, password } = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ name, password });

    expect(response.status).toBe(400);
  });

  it('should not register user with invalid email', async () => {
    const user = await factory.attrs('User', {
      email: 'Emailerrado.com',
    });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });
});

describe('Update User', () => {
  const roberto = {
    email: 'roberto@meditana.com',
    password: '123456',
  };

  const joana = {
    email: 'joana@meditana.com',
    password: '654321',
  };

  beforeEach(async () => {
    await truncate();
  });

  it('should be able to update one user name', async () => {
    const { email, name: oldName } = await factory.create('User', {
      password: '123456',
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const updatedUser = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ email, name: faker.name.findName() });

    expect(updatedUser.body.name).not.toBe(oldName);
  });

  it('should not update to a duplicate email', async () => {
    await factory.create('User', roberto);

    await factory.create('User', joana);

    const session = await request(app)
      .post('/sessions')
      .send({ email: roberto.email, password: roberto.password });

    const updatedUser = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ email: joana.email });

    expect(updatedUser.status).toBe(400);
  });

  it('should check if passwords not match', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const updatedUser = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        oldPassword: '123456',
        password: '1234567',
        confirmPassword: 'qwertyui',
      });

    expect(updatedUser.status).toBe(400);
  });

  it('should check if password change have less than 6 characteres', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const updatedUser = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        oldPassword: '123456',
        password: '1234',
        confirmPassword: '1234',
      });

    expect(updatedUser.status).toBe(400);
  });

  it('should check if oldPassword are correct', async () => {
    const { email } = await factory.create('User', {
      password: '123456',
      admin: true,
    });

    const session = await request(app)
      .post('/sessions')
      .send({ email, password: '123456' });

    const updatedUser = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        email,
        oldPassword: '12345678',
        password: '1234567',
        confirmPassword: '1234567',
      });

    expect(updatedUser.status).toBe(401);
  });
});
