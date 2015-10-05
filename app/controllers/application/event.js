'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.get('/application/:app/event/:event', middlewares.passport, (req, res) => {
    core.applicationManager.findBy(req.user.id, req.params.app, (err, application) => {
      if(err || !application) {
        return res.redirect('/404');
      }

      res.render('application/event', {
        slug: `${application.displayName} - Event`, 
        app: application.toViewModel(),
        event: null
      });

    });
  });
};
