const { compare } = require('../helpers/hash-helper');
const { signToken } = require('../helpers/jwt-helper');
const { User } = require('../models');
const { BadRequest } = require('../utils/http-exception');

class AuthController {
  static async register(req, res, next) {
    const { username, email, password } = req.body;
    try {
      const user = await User.create({ username, email, password });
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email || !password) throw new BadRequest('Invalid credentials');
      const user = await User.findOne({ where: { email } });
      if (!user) throw new BadRequest('Invalid credentials');
      const isPasswordMatch = compare(password, user.password);
      if (!isPasswordMatch) throw new BadRequest('Invalid credentials');
      const accessToken = signToken({ id: user.id, email: user.email });
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
