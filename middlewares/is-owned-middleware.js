const { Todo } = require('../models');
const { Forbidden } = require('../utils/http-exception');

async function isOwnedMiddleware(req, res, next) {
  const { id } = req.params;
  const user = req.user;
  try {
    const todo = await Todo.findOne({
      where: {
        id,
        UserId: user.id,
      },
    });
    if (!todo) throw new Forbidden();
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = isOwnedMiddleware;
