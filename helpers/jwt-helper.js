const jwt = require('jsonwebtoken');

function signToken(value) {
  return jwt.sign(value, process.env.JWT_SECRET);
}

function verifyToken(value) {
  return jwt.verify(value, process.env.JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
