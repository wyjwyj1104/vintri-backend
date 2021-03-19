const logger = require("./logger.service");
const errorMessages = require('../constants/errorMessages.js');
const Beer = require('../models/beer');

const saveData = async (name, description, first_brewed, food_pairings) => {
  try {
    return await Beer.findOneAndUpdate({
      name: name
    }, {
      description: description,
      first_brewed: first_brewed,
      food_pairings: food_pairings
    }, {
      new: true,
      upsert: true
    }).lean();
  } catch (e) {
    logger.error('Error creating beer data', e);
    throw {
      code: 500,
      message: {
        message: errorMessages.ERROR_INTERNAL_SERVER
      }
    }
  }
};

const addBeersRating = async (id, rating) => {
  const findBeer = await Beer.findOne({
    _id: id
  }).lean();
  if (!findBeer) {
    throw {
      code: 404,
      message: errorMessages.ERROR_NOT_FOUND
    };
  }
  try {
    return await Beer.findOneAndUpdate({
      _id: id
    }, {
      rating: rating
    }, {
      new: true
    }).lean();
  } catch (e) {
    logger.error('Cannot add rating', e);
    throw {
      code: 500,
      message: errorMessages.ERROR_INTERNAL_SERVER
    };
  }
};

module.exports = {
  saveData,
  addBeersRating
};