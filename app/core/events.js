'use strict'

var mongoose = require('mongoose');

class EventManager {
  constructor(options) {
    this._core = options.core;
    this._event = mongoose.model('Event');
  }

  create(appId, requestBody, cb) {
    
  }
}

module.exports = EventManager;
