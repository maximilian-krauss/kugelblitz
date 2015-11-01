'use strict'

var UserManager = require('./users'),
    ApplicationManager = require('./applications'),
    EventManager = require('./events'),
    MetricManager = require('./metrics'),
    Pingback = require('./pingback');

class Core {
  constructor() {
    this._userManager = new UserManager({ core: this });
    this._applicationManager = new ApplicationManager({ core: this });
    this._eventManager = new EventManager({ core:this });
    this._metricManager = new MetricManager({ core: this });
    this._pingback = new Pingback();
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

  get metricManager() {
    return this._metricManager;
  }

  get pingback() {
    return this._pingback;
  }
}

module.exports = new Core();
