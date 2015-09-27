'use strict'

module.exports = function() {
  var app = this.app,
      core = this.core,
      middlewares = this.middlewares;

  app.post('/event/heartbeat', middlewares.token, (req, res) => {
    let application = req.app;
    application.lastHeartbeat = Date.now();

    application.save(function(err) {
      if(err) {
        console.error('Could not save appication:', err);
      }
      res.send({ pong:true });
    });
  });

  app.post('/event/report', middlewares.token, (req, res) => {
    let application = req.app;

    appication.lastHeartbeat = Date.now();
    application.lastError = Date.now();

    appication.save(function(err) {
      if(err) {
        return req.status(500).send();
      }

      core.eventManager.create(application.id, req.body, function(err) {
        if(err) {
          return res.status(400).send();
        }

        res
          .status(201)
          .send({ reported: true });
      });

    });
  });
};
