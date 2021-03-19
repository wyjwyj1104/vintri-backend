const {
  query,
  header
} = require('express-validator');

const validateGetBeers = [
  query('name').exists().isString(),
  header('x-user').exists().isEmail()

];

module.exports = validateGetBeers;