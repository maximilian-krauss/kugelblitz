'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.post('/api/v1/heartbeat', middlewares.token, (req, res) => {
    req.app.updateHeartbeat((err) => {
      if(err) {
        console.error('Failed to update heartbeat:', err.message);
        return res.status(500).send();
       }

      if(core.pingback.shouldICallBack(req.body)) {
        core.pingback.ping(req.body.callback).then(result => {
          core.metricManager.updateResponseTimeFor(req.app, result.responseTimeInMs)
            .then(_ => res.send({ pong: true }))
            .catch(_ => res.status(500).send());

        }).catch(err => {
          console.error('Failed to ping back:', err);
          res.status(500).send();
        });
      }
      else {
        res.send({ pong: true });
      }
    });
  });
};
