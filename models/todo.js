'use strict';
const { Model } = require('sequelize');
const { BadRequest } = require('../utils/http-exception');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'title is required' },
          notEmpty: { msg: 'title is required' },
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: 'due_date is required' },
          notEmpty: { msg: 'due_date is required' },
          isDateNotYetPassed(value) {
            const today = new Date();
            const yesterday = today.setDate(today.getDate() - 1);
            if (value < yesterday) {
              throw new BadRequest('due date already passed)');
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Todo',
    }
  );
  return Todo;
};
