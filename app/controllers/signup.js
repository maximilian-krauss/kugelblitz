'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        config = this.config;

  let _canSignup = (req, res, next) => {
    if(!config.allowSignup) {
      return res.status(401).send({error: 'Signup has been disabled'});
    }
    next();
  };

  app.get('/signup', _canSignup, (req, res) => {
    res.render('signup', {
      slug: 'Create a brand new account'
    });
  });

  app.post('/signup', _canSignup, (req, res) => {
    core.userManager.create(req.body, (err, usr) => {
      if(err) {
        return res.status(400).render('signup', { error: err.message });
      }

      res.redirect(301, '/login');
    });
  });
}
