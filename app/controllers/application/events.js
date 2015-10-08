'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.get('/application/:name/events', middlewares.passport, (req, res) => {

    core.applicationManager.findBy(req.user.id, req.params.name, (err, application) => {
      if(err || !application) {
        return res.redirect('/404');
      }

      return res.render('application/events', {
        slug: `${application.displayName} - Events`,
        app: application.toViewModel()
      });
    });

  });
};
