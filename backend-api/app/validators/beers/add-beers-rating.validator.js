const {
  query,
  param,
  header
} = require('express-validator');

const validateAddBeersRating = [
  param('id').isMongoId(),
  header('x-user').exists().isEmail(),
  query('rating').exists().isNumeric().custom((to, {
    req
  }) => {
    if (req.query.rating > 5 || req.query.rating < 1) {
      throw new Error('Rating value invalid');
    }
    return true;
  }),
];

module.exports = validateAddBeersRating;