const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
  getBeers
} = require('../../validators');

describe('Get Beers Validator', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    app.get('/beers', getBeers, (req, res) => res.status(200).send());
  });

  it('should return 400 when req.header.x-user is not a valid email', (done) => {
    request(app).get('/beers').set('x-user', 'qwe').expect(400, done);
  });

  it('should pass when req.header.x-user is a valid email', (done) => {
    request(app).get('/beers').set('x-user', 'qwe@gmail.com').expect(400, done);
  });

  it('should pass when req.param.name is a valid string', (done) => {
    request(app)
      .get('/beers?name=beer')
      .set('x-user', 'qwe@gmail.com')
      .expect(200, done);
  });
});