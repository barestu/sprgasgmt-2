'use strict';
const { Model } = require('sequelize');
const { hash } = require('../helpers/hash-helper');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo, { foreignKey: 'UserId' });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'email is already used' },
        validate: {
          notNull: { msg: 'email is required' },
          notEmpty: { msg: 'email is required' },
          isEmail: { msg: 'email format invalid' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'password is required' },
          notEmpty: { msg: 'password is required' },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'username is required' },
          notEmpty: { msg: 'username is required' },
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate(instance) {
          instance.password = hash(instance.password);
        },
      },
    }
  );
  return User;
};
