'use strict';

var mongoose = require('mongoose');

var goalSchema = mongoose.Schema({
  action: String,
  number: Number,
  unit: String,
  date: Date,
  created: Date,
  because: String,

  progress: [{date: Date, number: Number}]

});

goalSchema.methods.done = function () {
  var message = 'I want to ' + this.action +
    ' ' + this.number + ' ' + this.unit + '.';
  console.log(message);
};

exports.Goal = mongoose.model('Goal', goalSchema);
