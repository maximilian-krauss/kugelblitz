'use strict'

var mongoose = require('mongoose');

class EventManager {
  constructor(options) {
    this._core = options.core;
    this._event = mongoose.model('Event');
  }

  /*
    requestBody:
      type, payload
  */
  create(appId, requestBody, cb) {
    cb(new Error('Not implemented yet'));
  }
}

module.exports = EventManager;
