'use strict';

const { hash } = require('../helpers/hash-helper');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@email.com',
        password: hash('12345'),
        username: 'Administrator',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'bob@email.com',
        password: hash('12345'),
        username: 'Bob Monroe',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
