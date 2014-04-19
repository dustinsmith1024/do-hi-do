'use strict';

var Goal = require('../models/goals').Goal;

/**
 * Find goal by id
 */
exports.goal = function(req, res, next, id) {
  Goal.load(id, function(err, goal) {
      if (err) return next(err);
      if (!goal) return next(new Error('Failed to load goal ' + id));
      req.goal = goal;
      next();
  });
};

exports.destroy = function(req, res) {
  var goal = req.goal;

  goal.remove(function(err) {
    if (err) {
      console.log('error deleting goadl!!');
    }else{
      res.send(goal);
    }
  })
};

exports.myGoals = function(req, res) {
  var goals = Goal.find({user: req.user});
  
  goals.populate('user', 'name username')
    .exec(function (err, goals) {
      if (err) return console.error(err);
      console.log(goals);
      res.send(goals);
  });
};

exports.findAll = function(req, res) {
  var goals = Goal.find();
  goals.populate('user', 'name username')
    .exec(function (err, goals) {
      if (err) return console.error(err);
      console.log(goals);
      res.send(goals);
  });
};

exports.findById = function(req, res) {
  var query = {_id: req.params.id };
  Goal.findOne(query, function(err, doc){
    res.send(doc);
  });
};

exports.create = function(req, res) {
  console.log(req.params, req.body);
  var goal = new Goal(req.body);
  goal.user = req.user;

  goal.save(function(err, doc) {
    //TODO: Throw a proper error
    if(err){console.log(err); return false;}
    //populate the use name
    doc.populate('user', 'name username', function(err, fullDoc){
      res.send(fullDoc);
    });
  });
};

exports.addProgress = function(req, res) {
  console.log(req.params, req.body);
  var query = {_id: req.params.id };
  // updates
  /*goals.Goal.findOneAndUpdate(query, { action: 'new!' }, {}, function(err, doc){
    res.send(doc);
  });*/
  Goal.findOne(query, function(err, doc) {
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
  
  Goal.findOne(query, function(err, doc) {
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
