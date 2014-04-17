'use strict';

var goals = require('../controllers/goals');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (req.goal.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {
  app.get('/goals', goals.findAll);
  app.post('/goals', authorization.requiresLogin, goals.create);
  app.get('/goals/:id', authorization.requiresLogin, goals.findById);
  app.post('/goals/:id', authorization.requiresLogin, hasAuthorization, goals.addProgress);
  app.post('/goals/:id/progress/:progress_id', authorization.requiresLogin, hasAuthorization, goals.removeProgress);

  //TODO Setup app.param for goal id
  // Finish with setting up the articleId param
  //app.param('articleId', articles.article);
};
