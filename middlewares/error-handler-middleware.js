const { mapErrorsMessage } = require('../helpers');
const { BadRequest, Unauthorized } = require('../utils/http-exception');

function errorHandlerMiddleware(error, req, res, next) {
  const stackTrace = error;

  if (error.name === 'SequelizeUniqueConstraintError') {
    error = new BadRequest(mapErrorsMessage(error.errors));
  }

  if (error.name === 'SequelizeValidationError') {
    error = new BadRequest(mapErrorsMessage(error.errors));
  }

  if (error.name === 'SequelizeDatabaseError') {
    error = new BadRequest();
  }

  if (error.name === 'JsonWebTokenError') {
    error = new Unauthorized('Invalid token');
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    stackTrace,
  });
}

module.exports = errorHandlerMiddleware;
