'use strict';

angular.module('mean.goals').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/goals');

    
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $timeout(function() {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        //================================================
        // Check if the user is not conntect
        //================================================
        var checkLoggedOut = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') {
                    $timeout(function() {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');

                }

                // Not Authenticated
                else {
                    $timeout(deferred.resolve, 0);

                }
            });

            return deferred.promise;
        };
        //================================================


    $stateProvider
      .state('goals', {
        url: '/goals',
        templateUrl: 'public/goals/views/goals.html',
        controller: 'GoalsCtrl',
        data: {goals: 'all'}
      })
      .state('my goals', {
        url: '/goals/my',
        templateUrl: 'public/goals/views/goals.html',
        controller: 'GoalsCtrl',
        data: {goals: 'my'}
      })
      .state('my goals.new', {
        url: '/new',
        templateUrl: 'public/goals/views/new_goal.html',
        controller: 'NewGoalCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('goals.new', {
        url: '/new',
        templateUrl: 'public/goals/views/new_goal.html',
        controller: 'NewGoalCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('my goals.detail', {
        url: '/:id',
        templateUrl: 'public/goals/views/goal.html',
        controller: 'GoalCtrl'
      })
      .state('goals.detail', {
        url: '/:id',
        templateUrl: 'public/goals/views/goal.html',
        controller: 'GoalCtrl'
      });
  }]);
