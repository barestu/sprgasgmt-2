const bcryptjs = require('bcryptjs');

function hash(value) {
  return bcryptjs.hashSync(value, 10);
}

function compare(value, hashValue) {
  return bcryptjs.compareSync(value, hashValue);
}

module.exports = {
  hash,
  compare,
};
