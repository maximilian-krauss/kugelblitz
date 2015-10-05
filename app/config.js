'use strict'

const environment_token = 'KUGELBLITZ';

class Configuration {

  _readEnvironmentVariable(variable) {
    return process.env[`${environment_token}_${variable}`];
  }

  constructor() {
    this._mongoUri = this._readEnvironmentVariable('MONGO_URI');
    this._allowSignup = this._readEnvironmentVariable('ALLOW_SIGNUP') === 'true';
    this._sessionSecret = this._readEnvironmentVariable('SESSION_SECRET');
    this._cookieSecret = this._readEnvironmentVariable('COOKIE_SECRET');
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
