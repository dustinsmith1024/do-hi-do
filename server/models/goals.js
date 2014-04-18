'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoalSchema = mongoose.Schema({
  action: String,
  number: Number,
  unit: String,
  date: Date,
  created: Date,
  because: String,

  progress: [{date: Date, number: Number}],
  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});

GoalSchema.methods.done = function () {
  var message = 'I want to ' + this.action +
    ' ' + this.number + ' ' + this.unit + '.';
  console.log(message);
};

/**
 * Statics
 */
GoalSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

exports.Goal = mongoose.model('Goal', GoalSchema);
