'use strict'

var _ = require('lodash'),
    moment = require('moment');

module.exports = function() {
  let app = this.app,
      middlewares = this.middlewares,
      core = this.core;

  app.get('/', middlewares.passport, (req, res) => {
    core.applicationManager
      .findAll(req.user.id, (err, applications) => {
        if(err) {
          console.error('Failed to load applications:', err);
        }

        res.render('home', {
          slug: 'Dashboard',
          applications: applications
        });
      });
  });
};
