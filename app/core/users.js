'use strict'

var mongoose = require('mongoose');

class UserManager {
  constructor(options) {
    this._core = options.core;
    this._user = mongoose.model('User');
  }

  /*
    requestBody:
      email, displayName, password
  */
  create(requestBody, cb) {
    let user = new this._user({
      email: requestBody.email,
      password: requestBody.password,
      displayName: requestBody.displayName
    });

    user.save(cb);
  }

  authenticate(email, password, cb) {
    this._user.findOne({email: email}, (err, usr) => {
      if(err || !usr) {
        return cb(err || new Error('User not found'));
      }

      return usr.comparePassword(password, (err, isMatch) => {
        if(err || !isMatch) {
          return cb(err || new Error('Password does not match'));
        }

        cb(null, usr);
      });
    });
  }

  findBy(id, cb) {
    return this._user.findById(id, cb);
  }
}

module.exports = UserManager;
