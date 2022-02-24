const { BadRequest } = require('../utils/http-exception');

function errorHandlerMiddleware(error, req, res, next) {
  const stackTrace = error;

  if (error.name === 'SequelizeUniqueConstraintError') {
    error = new BadRequest(error.errors.map((e) => e.message));
  }

  if (error.name === 'SequelizeValidationError') {
    error = new BadRequest(error.errors.map((e) => e.message));
  }

  if (error.name === 'SequelizeDatabaseError') {
    error = new BadRequest();
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    stackTrace,
  });
}

module.exports = errorHandlerMiddleware;
