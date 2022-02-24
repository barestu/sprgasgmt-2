const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication-middleware');
const errorHandlerMiddleware = require('../middlewares/error-handler-middleware');
const authRoute = require('./auth-route');
const todosRoute = require('./todos-route');

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Working');
});

router.use('/auth', authRoute);
router.use('/todos', authenticationMiddleware, todosRoute);

router.use(errorHandlerMiddleware);

module.exports = router;
