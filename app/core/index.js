'use strict'

var UserManager = require('./users');
var ApplicationManager = require('./applications');

class Core {
  constructor() {
    this._userManager = new UserManager({ core: this });
    this._applicationManager = new ApplicationManager({ core: this });
  }

  get userManager() {
    return this._userManager;
  }

  get applicationManager() {
    return this._applicationManager;
  }
}

module.exports = new Core();
