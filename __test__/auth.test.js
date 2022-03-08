const request = require('supertest');
const app = require('../app');
const { queryInterface } = require('../models/index').sequelize;
const { hash } = require('../helpers/hash-helper');
const { verifyToken } = require('../helpers/jwt-helper');

beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkInsert('Users', [
    {
      username: 'User',
      email: 'user@email.com',
      password: hash('12345'),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

describe('Auth Feature', () => {
  it('should register success', async () => {
    const user = {
      username: 'Test',
      email: 'test@email.com',
      password: '12345',
    };
    const { body } = await request(app)
      .post('/auth/register')
      .send(user)
      .expect(201);
    expect(body.username).toBe(user.username);
    expect(body.email).toBe(user.email);
  });

  it('should register failed because invalid email', async () => {
    const user = {
      username: 'Test',
      email: 'wrongemail.com',
      password: '12345',
    };
    const { body } = await request(app)
      .post('/auth/register')
      .send(user)
      .expect(400);
    expect(body.message[0]).toBe('email format invalid');
  });

  it('should register failed because email already used', async () => {
    const user = {
      username: 'Test',
      email: 'user@email.com',
      password: '12345',
    };
    const { body } = await request(app)
      .post('/auth/register')
      .send(user)
      .expect(400);
    expect(body.message[0]).toBe('email is already used');
  });

  it('should register failed because username is empty', async () => {
    const user = {
      email: 'nousername@email.com',
      password: '12345',
    };
    const { body } = await request(app)
      .post('/auth/register')
      .send(user)
      .expect(400);
    expect(body.message[0]).toBe('username is required');
  });

  it('should login success', async () => {
    const user = {
      email: 'user@email.com',
      password: '12345',
    };
    const { body } = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(200);
    const payload = verifyToken(body.accessToken);
    expect(payload).toEqual(
      expect.objectContaining({
        email: user.email,
      })
    );
  });

  it('should login failed because wrong password', async () => {
    const user = {
      email: 'user@email.com',
      password: 'wrongpassword',
    };
    const { body } = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(400);
    expect(body.message).toBe('Invalid credentials');
  });

  it('should login failed because email is empty', async () => {
    const user = {
      password: 'wrongpassword',
    };
    const { body } = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(400);
    expect(body.message).toBe('Invalid credentials');
  });
});
