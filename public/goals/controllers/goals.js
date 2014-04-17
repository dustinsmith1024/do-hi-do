'use strict';

angular.module('mean.goals')
  .controller('GoalsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.loaded=false;
    $http({method: 'GET', url: '/goals/', xsrfHeaderName: '_csrf'})
      .success(function(data, status, headers, config) {
        console.log('Got goals: ', data);
        $scope.goals = data;
        // used to delay loading of the detail view
        $scope.loaded=true;
      })
      .error(function(data, status, headers, config) {
        console.log('Err loading goals:', data);
      });
  }]);

angular.module('mean.goals')
  .controller('GoalCtrl', 
     ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {
    console.log("Looking up goal: ", $stateParams.id);

    angular.forEach($scope.goals, function(value, key){
      //ID's are integers in Sails/DB right now so convert the ID to a integer
      //Changed to double == so string matches an integer
       if(value._id==$stateParams.id){
         $scope.goal = value;
         console.log('Found goal: ', $scope.goal);
       }else{
        //redirect or something here
        console.warn('COULD NOT FIND YOUR GOAL');
       }
    });

    $scope.addProgress = function(e) {
      console.log('Added goal progress.');

      var postData = {date: $scope.date, number: $scope.number};
      $http.post('/goals/' + $scope.goal._id, postData)
        .success(function(data, status, headers, config) {
          console.log(data);
          // Could just return the 1 progress object but this works for now
          $scope.goal.progress = data.progress;
        })
        .error(function(){
          console.log('update failed!');
        });
    };

    $scope.removeProgress = function(progress_id) {
      console.log('Removing goal progress.', progress_id);

      $http.post('/goals/' + $scope.goal._id + "/progress/" + progress_id)
        .success(function(data, status, headers, config) {
          console.log(status);
          angular.forEach($scope.goal.progress, function(log, key) {
            if(log._id===progress_id){
              //remove 1 from key
              $scope.goal.progress.splice(key, 1);
            }
          });
        })
        .error(function(){
          console.log('update failed!');
        })
    };
  }]);

angular.module('mean.goals')
  .controller('NewGoalCtrl', 
     ['$scope', '$http', function($scope, $http) {
    console.log("Setting up new goal");

    $scope.addGoal = function(e) {
      console.log('Added a new goal!!');

      var postData = {
        action: $scope.action, 
        number: $scope.number,
        unit: $scope.unit,
        date: $scope.date,
        because: $scope.because,
        created: Date.now()
      };
      $http.post('/goals', postData)
        .success(function(data, status, headers, config) {
          console.log(data);
          // Could just return the 1 progress object but this works for now
          $scope.goals.push(data);
          //redirect to goal
        })
        .error(function(){
          console.log('add failed!');
        });
    };
  }]);
