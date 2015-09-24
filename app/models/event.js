var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var EventSchema = new mongoose.Schema({
  owner: {
    type: ObjectId,
		ref: 'Application',
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  payload: {
    type: Object,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Event', EventSchema);
