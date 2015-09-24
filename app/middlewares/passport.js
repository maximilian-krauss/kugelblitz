'use strict'

module.exports = (req, res, next) => {
  if(req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect('/login');
  }
}
