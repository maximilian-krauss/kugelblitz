'use strict'

module.exports = function() {
  var app = this.app,
      core = this.core,
      middlewares = this.middlewares;

  app.post('/event/ping', middlewares.token, (req, res) => {
    console.log(req.app);
    res.send({pong:true});
  });
};
