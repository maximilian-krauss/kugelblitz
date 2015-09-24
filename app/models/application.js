'use strict'

var mongoose = require('mongoose'),
    validate = require('mongoose-validate'),
    crypto = require('crypto'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var ApplicationSchema = new mongoose.Schema({
  owner: {
    type: ObjectId,
		ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [ validate.permalink, 'Invalid name' ]
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  token: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    lowercase: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastHeartbeat: {
    type: Date,
    default: null
  },
  lastError: {
    type: Date,
    default: null
  },
  events: [{
    type: ObjectId,
    ref: 'Event'
  }]
});

ApplicationSchema.pre('save', function(next) {
  var app = this;

  if(app.token) {
    return next();
  }

  crypto.randomBytes(24, (e, buffer) => {
    app.token = buffer.toString('hex');
    next();
  });
});

module.exports = mongoose.model('Application', ApplicationSchema);
