require('dotenv').config();

const express = require('express');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(port, function () {
  console.log('Running on port', port);
});
