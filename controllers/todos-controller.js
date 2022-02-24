const { Todo, User } = require('../models');
const { NotFound } = require('../utils/http-exception');

class TodosController {
  static async findAll(req, res, next) {
    const user = req.user;
    try {
      const todos = await Todo.findAll({
        where: {
          UserId: user.id,
        },
      });
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req, res, next) {
    const { id } = req.params;
    try {
      const todo = await Todo.findByPk(id, {
        include: [User],
      });
      if (!todo) throw new NotFound('Todo not found');
      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const { title, description, due_date } = req.body;
    try {
      const todo = await Todo.create({
        title,
        description,
        due_date,
        UserId: req.user.id,
      });
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { title, description, due_date } = req.body;
    try {
      const [affectedRows, rows] = await Todo.update(
        {
          title,
          description,
          due_date,
        },
        {
          where: { id },
          returning: true,
        }
      );
      if (!affectedRows) throw new NotFound('Todo not found');
      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      await Todo.destroy({ where: { id } });
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodosController;
