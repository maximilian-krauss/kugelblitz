'use strict'

var mongoose = require('mongoose'),
    response401 = { error: 'Unauthorized' };

let _validate = (token, cb) => {
  var appScheme = mongoose.model('Application');

  appScheme.findOne({ token: token }, (err, app) => {
    if(err || !app) {
      return cb(new Error('Invalid token'));
    }

    cb(null, app);
  });
};


module.exports = (req, res, next) => {
  let token = req.get('x-kugelblitz-token');
  if(!token) {
    return res.status(401).send(response401);
  }

  _validate(token, (err, app) => {
    if(err || !app) {
      return res.status(401).send(response401);
    }

    req.app = app;
    return next();
  });
};
