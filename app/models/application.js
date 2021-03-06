'use strict'

const _ = require('lodash'),
      mongoose = require('mongoose'),
      validate = require('mongoose-validate'),
      crypto = require('crypto'),
      moment = require('moment'),
      ObjectId = mongoose.Schema.Types.ObjectId;

var ApplicationSchema = new mongoose.Schema({
  owner: {
    type: ObjectId,
		ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [ validate.permalink, 'Invalid name' ]
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  token: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    lowercase: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastHeartbeat: {
    type: Date,
    default: null
  },
  lastError: {
    type: Date,
    default: null
  },
  warnRetentionInMinutes: {
    type: Number,
    default: 60
  },
  deadRetentionInMinutes: {
    type: Number,
    default: 180
  },
  events: [{
    type: ObjectId,
    ref: 'Event'
  }]
});

ApplicationSchema.pre('save', function(next) {
  var app = this;

  if(app.token) {
    return next();
  }

  crypto.randomBytes(24, (e, buffer) => {
    app.token = buffer.toString('hex');
    next();
  });
});

ApplicationSchema.methods.updateHeartbeat = function(cb) {
  let app = this;
  app.lastHeartbeat = Date.now();
  app.save(cb);
};

ApplicationSchema.methods.insertReport = function(report, cb) {
  var app = this;

  if(report.type === 'error') {
    app.lastError = Date.now();
  }

  app.events.push(report.id);

  app.save(cb);
};

ApplicationSchema.methods.status = function() {
  let app = this,
      dead = { text: 'dead', cssClass: 'state-closed' },
      walkingDead = { text: 'walking dead', cssClass: 'state-merged' },
      healthy = { text: 'healthy', cssClass: 'state-open' };


  if(!app.lastHeartbeat) {
    return dead;
  }

  const minutesSinceLastHeartbeat = moment().diff(app.lastHeartbeat, 'minutes');

  if(minutesSinceLastHeartbeat < app.warnRetentionInMinutes) {
    return healthy;
  }

  if(minutesSinceLastHeartbeat >= app.warnRetentionInMinutes
    && minutesSinceLastHeartbeat < app.deadRetentionInMinutes)
  {
    return walkingDead;
  }

  return dead;
}

ApplicationSchema.methods.toViewModel = function() {
  let app = this;

  return {
    name: app.name,
    token: app.token,
    displayName: app.displayName,
    description: app.description,
    lastError: app.lastError,
    lastHeartbeat: app.lastHeartbeat,
    warnRetentionInMinutes: app.warnRetentionInMinutes,
    deadRetentionInMinutes: app.deadRetentionInMinutes,
    status: app.status(),
    url: app.url,
    events: _.chain(app.events)
      .sortBy((e) => e.created)
      .reverse()
      .value()
  };
};

module.exports = mongoose.model('Application', ApplicationSchema);
