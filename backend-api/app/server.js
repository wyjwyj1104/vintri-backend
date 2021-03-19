const express = require('express');
require('dotenv').config();
console.log("Node env is: " + process.env.NODE_ENV);
const app = express();

const fs = require('fs');
const path = require('path');
const cors = require('cors');
var winston = require('winston');
const aws = require('aws-sdk');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')
const logger = require('./services/logger.service');
const beers = require('./controllers/beers.controller');
const validators = require('./validators');

const basicAuthentication = basicAuth({
  users: {
    admin: 'qwe123'
  },
  challenge: true,
  unauthorizedResponse: 'Error Unauthorized.'
})

app.use(bodyParser.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.options('*', cors({
  origin: true,
  credentials: true
}));
app.get('/', basicAuthentication, function(req, res) {
  res.status(200).send({
    "message": "ACK",
    "version": "20210318"
  });
});

app.get('/beers', basicAuthentication, validators.getBeers, beers.getBeers);
app.put('/beers/:id', basicAuthentication, validators.addBeersRating, beers.addBeersRating);

// NODE_ENV=dev  nodemon server.js
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

mongoose.connect(process.env.DB_URL, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, function(err) {
  if (!err) {
    logger.debug("We're connected to mongo");
  } else {
    logger.debug("!!! MONGO ERROR ------ NOT CONNECTED !!!");
  }
});

const server = app.listen(3000, function() {
  logger.debug('listening on port ', server.address().port);
});