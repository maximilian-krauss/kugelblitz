'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.get('/application/:name', middlewares.passport, (req, res) => {
    core.applicationManager.findBy(req.user.id, req.params.name, (err, app) => {
      if(err || !app) {
        return res.redirect('/404');
      }

      return res.render('application/view', {
        slug: app.displayName,
        app: app.toViewModel()
      });
    });
  });
};
