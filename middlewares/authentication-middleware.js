const { User } = require('../models');
const { verifyToken } = require('../helpers/jwt-helper');
const { Unauthorized } = require('../utils/http-exception');
const { extractBearerToken } = require('../helpers');

async function authenticationMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new Unauthorized();
    }

    const { email } = verifyToken(token);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Unauthorized();
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticationMiddleware;
