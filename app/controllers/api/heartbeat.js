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

       res.send({ pong: true })
    });
  });
};
