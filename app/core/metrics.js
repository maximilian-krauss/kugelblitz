'use strict'

const _ = require('lodash'),
      mongoose = require('mongoose'),
      moment = require('moment');

class MetricManager {
  constructor(options) {
    this._core = options.core;
    this._metric = mongoose.model('Metric');
  }

  _generatePartitionKeyFrom(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  updateResponseTimeFor(app, responseTime) {
    let partitionKey = this._generatePartitionKeyFrom(Date.now()),
        query = { owner: app.id, partitionKey: partitionKey };

    return new Promise((rs, rj) => {

      this._metric.findOne(query, (err, doc) => {
        if(err) return rj(err);

        if(!doc) {
          doc = new this._metric({
            owner: app.id,
            partitionKey: partitionKey
          });
        }

        doc.responseTimeInMs = responseTime;

        doc.save(err => {
          if(err) return rj(err);
          rs();
        });

      });
    });
  }
}

module.exports = MetricManager;
