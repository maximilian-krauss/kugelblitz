'use strict'

var _ = require('lodash');

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares,
        newAppViewModel = { slug: 'Create a new application' };

  // application/new
  app.get('/application/new', middlewares.passport, (req, res) => {
    res.render('application-new', newAppViewModel);
  });

  app.post('/application/new', middlewares.passport, (req, res) => {
    core.applicationManager.create(req.user.id, req.body, (err, app) => {
      if(err) {
        console.error('Failed to create application:', err);
        return res.render('application-new', _.extend(_.clone(newAppViewModel), {
          error: err.message
        }));
      }

      return res.redirect('/');
    });
  });

  // application/:name/delete
  app.post('/application/:name/delete', middlewares.passport, (req, res) => {
    core.applicationManager.delete(req.user.id, req.params.name, (err) => {
      if(err) {
        console.error('Failed to delete app:', err);
      }
      return res.redirect('/');
    });
  });

  // application/:name
  app.get('/application/:name', middlewares.passport, (req, res) => {
    core.applicationManager.findBy(req.user.id, req.params.name, (err, app) => {
      if(err || !app) {
        return res.redirect('/404');
      }

      return res.render('application-view', {
        slug: app.displayName,
        app: app
      });
    });
  });
};
