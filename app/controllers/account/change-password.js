'use strict'

module.exports = function() {
  const app = this.app,
        core = this.core,
        middlewares = this.middlewares;

  app.get('/change-password', middlewares.passport, (req, res) => {
    res.render('account/change-password', {
      slug: 'Update your password'
    });
  });

  app.post('/change-password', middlewares.passport, (req, res) => {

    let _renderError = (err) => {
      res.status(400).render('account/change-password', {
        slug: 'Update your password',
        error: err
      });
    };

    if(req.body.newPassword !== req.body.reenteredPassword) {
      return _renderError('The new password does not match its confirmation!');
    }

    req.user.changePassword(req.body.currentPassword, req.body.newPassword, (err) => {
      if(err) {
        return _renderError(err.message);
      }
      return res.redirect('/');
    });

  });

};
