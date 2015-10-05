'use strict'

var mongoose = require('mongoose'),
    validate = require('mongoose-validate'),
    bcrypt = require('bcryptjs'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [ validate.email, 'invalid email address' ]
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

UserSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }

        return cb(null, isMatch);
    });
};

UserSchema.methods.changePassword = function(currentPassword, newPassword, cb) {
  var usr = this;

  usr.comparePassword(currentPassword, (err, matched) => {
    console.log(err, matched);
    if(err || !matched) {
      return cb(new Error('Old password does not match!'));
    }

    usr.password = newPassword;
    return usr.save(cb);

  });

};

module.exports = mongoose.model('User', UserSchema);
