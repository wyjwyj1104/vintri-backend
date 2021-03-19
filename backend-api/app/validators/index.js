const {
  validationResult
} = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  return next();
};

module.exports = {
  getBeers: [...require('./beers/get-beers.validator'), validate],
  addBeersRating: [...require('./beers/add-beers-rating.validator'), validate],
};