const request = require('supertest');
const app = require('../app');
const { hash } = require('../helpers/hash-helper');
const { signToken } = require('../helpers/jwt-helper');
const { queryInterface } = require('../models/index').sequelize;

const accessToken = {
  user: '',
  other: '',
  error: '',
};

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
    {
      username: 'Other',
      email: 'other@email.com',
      password: hash('12345'),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkDelete('Todos', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkInsert('Todos', [
    {
      title: 'Lorem',
      description: 'Lorem ipsum dolor sit amet',
      due_date: '01/01/2099',
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Ipsum',
      description: 'Lorem ipsum dolor sit amet',
      due_date: '01/01/2099',
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  accessToken.user = 'Bearer ' + signToken({ id: 1, email: 'user@email.com' });
  accessToken.other =
    'Bearer ' + signToken({ id: 2, email: 'other@email.com' });
  accessToken.error = accessToken.other + 'err';
});

describe('Todos', () => {
  it('should create success', async () => {
    const todo = {
      title: 'Test',
      description: 'Test description',
      due_date: '01/01/2090',
    };
    const { body } = await request(app)
      .post('/todos')
      .set('Authorization', accessToken.user)
      .send(todo)
      .expect(201);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('due_date');
  });

  it('should create failed because user is unauthorized', async () => {
    const todo = {
      title: 'Test',
      description: 'Test description',
      due_date: '01/01/2090',
    };
    const { body } = await request(app).post('/todos').send(todo).expect(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should create failed because due date is already passed', async () => {
    const todo = {
      title: 'Test',
      description: 'Test description',
      due_date: '01/01/2009',
    };
    const { body } = await request(app)
      .post('/todos')
      .set('Authorization', accessToken.user)
      .send(todo)
      .expect(400);
    expect(body.message[0]).toBe('due date already passed');
  });

  it('should get all owned todo', async () => {
    const { body } = await request(app)
      .get('/todos')
      .set('Authorization', accessToken.other)
      .expect(200);
    expect(body[0]).toHaveProperty('title');
    expect(body[0]).toHaveProperty('description');
    expect(body[0]).toHaveProperty('due_date');
  });

  it('should get all failed because token is invalid', async () => {
    const { body } = await request(app)
      .get('/todos')
      .set('Authorization', accessToken.error)
      .expect(401);
    expect(body.message).toBe('Invalid token');
  });

  it('should get one owned todo', async () => {
    const { body } = await request(app)
      .get('/todos/1')
      .set('Authorization', accessToken.other)
      .expect(200);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('due_date');
  });

  it('should forbidden to get another user todo', async () => {
    const { body } = await request(app)
      .get('/todos/1')
      .set('Authorization', accessToken.user)
      .expect(403);
    expect(body.message).toBe('Forbidden');
  });

  it('should update owned todo', async () => {
    const payload = {
      title: 'Test Update',
    };
    const { body } = await request(app)
      .put('/todos/1')
      .set('Authorization', accessToken.other)
      .send(payload)
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        title: payload.title,
      })
    );
  });

  it('should update failed because due date is empty value', async () => {
    const payload = {
      due_date: null,
    };
    const { body } = await request(app)
      .put('/todos/1')
      .set('Authorization', accessToken.other)
      .send(payload)
      .expect(400);
    expect(body.message[0]).toBe('due_date is required');
  });

  it('should delete owned todo', async () => {
    const { body } = await request(app)
      .delete('/todos/2')
      .set('Authorization', accessToken.other)
      .expect(200);
    expect(body).toEqual(expect.objectContaining({}));
  });
});
