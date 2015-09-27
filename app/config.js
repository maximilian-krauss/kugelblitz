'use strict'

const environment_token = 'MEERKAT';

class Configuration {
  constructor() {
    this._mongoUri = process.env[`${environment_token}_MONGO_URI`];
    this._allowSignup = process.env[`${environment_token}_ALLOW_SIGNUP`] === 'true';
    this._sessionSecret = process.env[`${environment_token}_SESSION_SECRET`];
    this._cookieSecret = process.env[`${environment_token}_COOKIE_SECRET`];
    this._production = process.env.NODE_ENV === 'production';
  }

  get mongoUri() {
    return this._mongoUri;
  }

  get allowSignup() {
    return this._allowSignup;
  }

  get sessionSecret() {
    return this._sessionSecret;
  }

  get cookieSecret() {
    return this._cookieSecret;
  }

  get production() {
    return this._production;
  }

}

module.exports = new Configuration();
