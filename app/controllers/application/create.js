'use strict'

const _ = require('lodash');

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares,
        viewModel = { slug: 'Create a new application' };

  app.get('/application/new', middlewares.passport, (req, res) => {
    res.render('application/create', viewModel);
  });

  app.post('/application/new', middlewares.passport, (req, res) => {
    core.applicationManager.create(req.user.id, req.body, (err, app) => {
      if(err) {
        console.error('Failed to create application:', err);
        return res.render('application/create', _.extend(_.clone(viewModel), {
          error: err.message
        }));
      }

      return res.redirect('/');
    });
  });
}
