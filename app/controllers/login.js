'use strict'

module.exports = function() {
  let app = this.app,
      core = this.core,
      passport = this.passport;

  app.get('/login', (req, res) => {
    if(req.isAuthenticated()) {
      return res.redirect('/');
    }

    res.render('login', {
      slug: 'Login'
    });
  });

  app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login' })
  );

  app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      req.logout();
      res.redirect('/');
    });
  });
};
