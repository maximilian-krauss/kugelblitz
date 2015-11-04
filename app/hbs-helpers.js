'use strict'

var moment = require('moment');

module.exports = {
	relativeDate: (date) => {
		if(!date) { return 'never' }

		return moment(date).fromNow();
	},
	trim: (str) => {
		return str
			.replace(/^\s\s*/, '')
			.replace(/\s\s*$/, '');
	},
	if_eq: (left, right, options) => {
		if (left == right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
	},
	json: (obj) => {
		return JSON.stringify(obj);
	}
};
