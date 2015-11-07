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
      responseTime: {
        labels: [],
        data: [],
        average: 0
      }
    };

    let averageResponseTime = _(metrics)
      .chain()
      .map(m => m.responseTimeInMs)
      .sum()
      .value();

    result.responseTime.average = metrics.length > 0
      ? (averageResponseTime / metrics.length).toFixed(1)
      : 0;

    for(let i = 13; i >= 0; i--) {
      let currentDate = moment().subtract(i, 'days');

      result.responseTime.labels.push(currentDate.format('MM/DD'));
      result.responseTime.data.push(_.result(_.find(metrics, {
        partitionKey: this._generatePartitionKeyFrom(currentDate)
      }), 'responseTimeInMs') || 0);
    }

    return result;
  }

  getMetricsFor(appId) {
    return new Promise((rs, rj) => {
      this._metric.find({ owner: appId })
        .limit(14)
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
