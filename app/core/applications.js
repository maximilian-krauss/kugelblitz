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

  /*
    requestBody:
      name, displayName, description, url, warnRetentionInMinutes, deadRetentionInMinutes
  */
  update(userId, requestBody, cb) {
    var query = { owner: userId, name: requestBody.name };

    this._application.update(query, {
        displayName: requestBody.displayName,
        description: requestBody.description,
        url: requestBody.url,
        warnRetentionInMinutes: requestBody.warnRetentionInMinutes,
        deadRetentionInMinutes: requestBody.deadRetentionInMinutes
      },
      { multi: false },
      cb
    );
  }

  delete(userId, name, cb) {
    this._application
      .find({ owner: userId, name: name })
      .remove(cb);
  }

  findAll(userId, cb) {
    this._application
      .find({ owner: userId })
      .exec(cb);
  }

  findBy(userId, name, cb) {
    this._application
      .findOne({ name: name, owner: userId })
      .populate('events')
      .exec(cb);
  }

}

module.exports = ApplicationManager;
