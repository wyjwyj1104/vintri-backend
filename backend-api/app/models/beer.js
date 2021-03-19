var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BeerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  first_brewed: {
    type: Date,
    required: true,
    default: Date.now
  },
  food_pairings: {
    type: [String],
    required: false,
    default: []
  },
  rating: {
    type: Number,
    required: false,
    default: -1,
  },
});

module.exports = mongoose.model('Beer', BeerSchema);