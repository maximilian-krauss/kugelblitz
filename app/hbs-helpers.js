'use strict'

var moment = require('moment');

module.exports = {
  relativeDate: (date) => {
    if(!date) { return 'never' }

    return moment(date).fromNow();
  }
};
