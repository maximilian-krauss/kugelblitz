'use strict'

module.exports = function() {
  var app = this.app,
      middlewares = this.middlewares,
      core = this.core;

  app.post('/event/:id/delete', middlewares.passport, (req, res) => {
    core.eventManager.deleteBy(req.params.id)
      .then(_ => res.status(200).send())
      .catch(err => {
        console.error('Failed to delete event:', err);
        res.status(500).send();
      });
  });
};
