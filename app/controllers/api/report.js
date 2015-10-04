'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.post('/api/v1/report', middlewares.token, (req, res) => {
    core.eventManager
      .create(req.app.id, req.body, (err, doc) => {
        if(err) {
          console.error('Failed to save event:', err);
          return res.status(500).send();
        }

        req.app.insertReport(doc, (err) => {
          if(err) {
            console.error('Failed to update application:', err);
            return res.status(500).send();
          }

          return res.status(201).send();
        });
      });
  });
};
