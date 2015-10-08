'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.get('/application/:app/event/:event', middlewares.passport, (req, res) => {
    core.eventManager.findOneBy(req.params.event)
      .then((evnt) => {
        let application = evnt.owner;

        if(!application.owner.equals(req.user.id)) {
          return res.status(401).send();
        }

        return res.render('application/event', {
          slug: `${application.displayName} - Event`,
          app: application.toViewModel(),
          event: evnt
        });
      })
      .catch((err) => {
        console.log(err);
        return res.redirect('/404');
      });
  });
};
