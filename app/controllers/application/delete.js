'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.post('/application/:name/delete', middlewares.passport, (req, res) => {
    core.applicationManager.delete(req.user.id, req.params.name, (err) => {
      if(err) {
        console.error('Failed to delete app:', err);
      }
      return res.redirect('/');
    });
  });
};
