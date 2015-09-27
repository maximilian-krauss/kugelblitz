'use strict'

module.exports = function() {
  const app = this.app;

  app.get('/keep-alive', (req, res) => {
    res.send({ alive: true });
  });
};
