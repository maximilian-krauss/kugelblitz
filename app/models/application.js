'use strict'

var mongoose = require('mongoose'),
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

function toTextDate(date) {
  return date
    ? moment(date).fromNow()
    : 'never';
}

ApplicationSchema.methods.toViewModel = function() {
  let app = this;

  return {
    name: app.name,
    displayName: app.displayName,
    description: app.description,
    lastError: app.lastError,
    lastErrorText: toTextDate(app.lastError),
    lastHeartbeat: app.lastHeartbeat,
    lastHeartbeatText: toTextDate(app.lastHeartbeat),
    warnRetentionInMinutes: app.warnRetentionInMinutes,
    deadRetentionInMinutes: app.deadRetentionInMinutes,
    status: app.status(),
    url: app.url
  };
};

module.exports = mongoose.model('Application', ApplicationSchema);
