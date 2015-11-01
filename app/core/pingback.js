'use strict'

const _ = require('lodash'),
      request = require('request'),
      moment = require('moment');

class Pingback {

  constructor() {
    this._defaultOptions = {
      url: null
    };
  }

  _squeeze(options) {
    return _.extend(
      _.clone(this._defaultOptions),
      options
    );
  }

  shouldICallBack(body) {
    return body
      && body.callback
      && body.callback.url;
  }

  ping(options) {
    return new Promise((rs, rj) => {
      let opts = this._squeeze(options);

      if(!opts.url) return rj(new Error('No callback URL provided'));

      let ping = { url: opts.url, method: 'HEAD' },
          requestStart = Date.now();

      request(ping, (err, response) => {
        if(err || response.statusCode !== 200) return rj(new Error('Failed to send callback'));

        rs({
          responseTimeInMs: moment( Date.now() - requestStart ).milliseconds()
        });
      });

    });
  }

}

module.exports = Pingback;
