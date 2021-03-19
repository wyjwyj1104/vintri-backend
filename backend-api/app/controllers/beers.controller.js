const async = require('async');
const axios = require('axios');
const moment = require('moment');
const logger = require('../services/logger.service');
const errorMessages = require('../constants/errorMessages');
const configs = require('../constants/configs');
const beersService = require('../services/beers.service');

const getStringDataFromURL = async (url) => {
  if (!url || url.length === 0)
    return null;
  let data;
  try {
    data = await axios.get(url);
  } catch (e) {
    return null;
  }
  return data.data;
}

const getBeersDataByName = async (url, name) => {
  if (!url || url.length === 0)
    return null;
  if (!name)
    return null;
  let data;
  try {
    let siteURL = decodeURI(url);
    const siteData = await getStringDataFromURL(siteURL);
    if (!siteData)
      throw {
        code: 500,
        message: errorMessages.ERROR_INTERNAL_SERVER
      };
    return siteData;
  } catch (e) {
    throw {
      code: 500,
      message: errorMessages.ERROR_INTERNAL_SERVER
    };
  }
}

//==============================================================================
// Task: 1
// ROUTE: http://localhost:3000/beers
// PRE-CONDITION:
//    @query x-user  Email
//    @query name    String
// POST-CONDITION:
//    {"id":1,"name":"Buzz","tagline":"A Real Bitter Experience.", ...
const getBeers = async (req, res) => {
  const beerName = req.query.name;
  try {
    let beers = await getBeersDataByName(configs.TESTING_SITE_URL, beerName);
    let result = beers.filter((obj) => obj.name.includes(beerName));
    for (let i = 0; i < result.length; i++) {
      let beer = result[i];
      let first_brewed = moment(beer.first_brewed, configs.DATE_FORMAT);
      let first_brewed_date = first_brewed.toDate();
      result = await beersService.saveData(beer.name, beer.description, first_brewed_date, beer.food_pairing);
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: errorMessages.ERROR_INTERNAL_SERVER
    });
  }
};
//==============================================================================

//==============================================================================
// Task: 2
// ROUTE: http://localhost:3000/beers/:id
// PRE-CONDITION:
//    @params  id      String
//    @query   x-user  Email
//    @query   rating  Number (1-5)
// POST-CONDITION:
//    {"id":1,"name":"Buzz","tagline":"A Real Bitter Experience.", ..., "rating": 2
const addBeersRating = async (req, res) => {
  let id = req.params.id;
  let rating = req.query.rating;
  if (rating > configs.RATING_MAX || rating < configs.RATING_MIN) {
    return res.status(500).json({
      message: errorMessages.ERROR_INTERNAL_SERVER
    });
  }
  try {
    const result = await beersService.addBeersRating(id, rating);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: errorMessages.ERROR_INTERNAL_SERVER
    });
  }
};
//==============================================================================

module.exports = {
  getBeers,
  addBeersRating
};