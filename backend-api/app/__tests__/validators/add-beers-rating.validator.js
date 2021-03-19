const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
  addBeersRating
} = require('../../validators');

describe('Get Beers Validator', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    app.put('/beers/:id', addBeersRating, (req, res) => res.status(200).send());
  });

  it('should return 400 when req.param.id is not a valid UUID', (done) => {
    request(app).put('/beers/fake-id').expect(400, done);
  });

  it('should return 400 when req.header.x-user is not a valid email', (done) => {
    request(app).put('/beers/6054564a15ad51a92e9b4c5c').set('x-user', 'qwe').expect(400, done);
  });

  it('should return 400 when req.param.rating is not a valid number', (done) => {
    request(app).put('/beers/6054564a15ad51a92e9b4c5c?rating=0').set('x-user', 'qwe').expect(400, done);
  });

  it('should return 400 when req.header.x-user is not a valid email', (done) => {
    request(app).put('/beers/6054564a15ad51a92e9b4c5c?rating=1').set('x-user', 'qwe').expect(400, done);
  });

  it('should pass when req is valid', (done) => {
    request(app).put('/beers/6054564a15ad51a92e9b4c5c?rating=1').set('x-user', 'qwe@gmail.com').expect(200, done);
  });
});