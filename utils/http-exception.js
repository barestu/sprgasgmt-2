class HttpException extends Error {
  constructor(message, status) {
    super();
    this.name = this.constructor.name;
    this.message = message || 'Internal server error';
    this.status = status || 500;
  }
}

class BadRequest extends HttpException {
  constructor(message) {
    super(message || 'Bad request', 400);
  }
}

class Unauthorized extends HttpException {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

class Forbidden extends HttpException {
  constructor(message) {
    super(message || 'Forbidden', 403);
  }
}

class NotFound extends HttpException {
  constructor(message) {
    super(message || 'Not found', 404);
  }
}

module.exports = {
  HttpException,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
};
