'use strict'

var _ = require('lodash'),
    mongoose = require('mongoose');

class ApplicationManager {
  constructor(options) {
    this._core = options.core;
    this._application = mongoose.model('Application');
  }

  /*
  requestBody:
    name, displayName, url
  */
  create(userId, requestBody, cb) {
    const application = new this._application(_.extend(
      requestBody,
      { owner: userId }
    ));

    application.save(cb);
  }

  delete(userId, name, cb) {
    this._application
      .find({ owner: userId, name: name })
      .remove(cb);
  }

  findAll(userId, cb) {
    this._application.find({ owner: userId }, cb);
  }

  findBy(userId, name, cb) {
    this._application.findOne({ name: name, owner: userId }, cb);
  }

}

module.exports = ApplicationManager;
