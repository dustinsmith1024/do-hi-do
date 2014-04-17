'use strict';

var goals = require('../models/goals');

exports.findAll = function(req, res) {
  goals.Goal.find(function (err, goals) {
      if (err) return console.error(err);
      console.log(goals);
      res.send(goals);
  });
};

exports.findById = function(req, res) {
  var query = {_id: req.params.id };
  goals.Goal.findOne(query, function(err, doc){
    res.send(doc);
  });
};

exports.create = function(req, res) {
  console.log(req.params, req.body);

  goals.Goal.create(req.body, function(err, doc) {
    if(err){console.log(err); return false;}
    if(!doc){console.warn('coudnt find this doc'); return false;}
    
    res.send(doc);
  });
};

exports.addProgress = function(req, res) {
  console.log(req.params, req.body);
  var query = {_id: req.params.id };
  // updates
  /*goals.Goal.findOneAndUpdate(query, { action: 'new!' }, {}, function(err, doc){
    res.send(doc);
  });*/
  goals.Goal.findOne(query, function(err, doc) {
    if(err){console.log(err); return false;}
    if(!doc){console.warn('coudnt find this doc'); return false;}
    doc.progress.push({date: req.body.date, number: req.body.number});
    doc.save(function(err, doc) {
      res.send(doc);
    });
  });
};

exports.removeProgress = function(req, res) {
  console.log(req.params, req.body);
  var query = {_id: req.params.id };
  
  goals.Goal.findOne(query, function(err, doc) {
    if(err){console.log(err); return false;}
    if(!doc){console.warn('coudnt find this doc'); return false;}

    // find and remove sub doc
    // todo: needs error catching
    doc.progress.id(req.params.progress_id).remove();
    // save and return full doc
    doc.save(function(err, doc) {
      res.send(doc);
    });
  });
};
