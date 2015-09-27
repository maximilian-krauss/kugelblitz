'use strict'

var UserManager = require('./users'),
    ApplicationManager = require('./applications'),
    EventManager = require('./events');

class Core {
  constructor() {
    this._userManager = new UserManager({ core: this });
    this._applicationManager = new ApplicationManager({ core: this });
    this._eventManager = new EventManager({ core:this });
  }

  get userManager() {
    return this._userManager;
  }

  get applicationManager() {
    return this._applicationManager;
  }

  get eventManager() {
    return this._eventManager;
  }
}

module.exports = new Core();
