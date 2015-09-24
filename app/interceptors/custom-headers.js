'use strict'

module.exports = function() {
  const app = this.app;

  app.use((req, res, next) => {
    res.set('X-Krauss-Ping', 'Pong');
    res.set('Arr-Disable-Session-Affinity', 'True'); // http://azure.microsoft.com/blog/2013/11/18/disabling-arrs-instance-affinity-in-windows-azure-web-sites/
    next();
  });
}
