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

  _mergeMetrics(metrics) {
    let result = {
      labels: [],
      data: []
    };

    for(let i = 13; i >= 0; i--) {
      let currentDate = moment().subtract(i, 'days');
      result.labels.push(currentDate.format('MM/DD'));
      result.data.push(_.result(_.find(metrics, {
        partitionKey: this._generatePartitionKeyFrom(currentDate)
      }), 'responseTimeInMs') || 0);
    }

    return result;
  }

  getMetricsFor(appId) {
    return new Promise((rs, rj) => {
      this._metric.find({ owner: appId })
        .limit(30)
        .sort({created: 1})
        .exec((err, docs) => {
          if(err) { return rj(err); }

          return rs(this._mergeMetrics(docs));
        });
    });
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
