'use strict'

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
  owner: {
    type: ObjectId,
    ref: 'Application',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  partitionKey: {
    type: String,
    required: true
  },
  responseTimeInMs: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Metric', UserSchema);
