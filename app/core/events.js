'use strict'

const _ = require('lodash'),
      mongoose = require('mongoose');

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
    let evnt = new this._event(_.extend(
      requestBody,
      {
        owner: appId,
        payload: JSON.parse(requestBody.payload)
      }
    ));

    evnt.save(cb);
  }

  findOneBy(id) {
    return new Promise((rs, rj) => {
      this._event.findOne({ _id: id })
        .populate('owner')
        .exec((err, doc) => {
          return (err || !doc)
            ? rj(err || new Error('Event not found'))
            : rs(doc);
        });
    });
  }

}

module.exports = EventManager;
