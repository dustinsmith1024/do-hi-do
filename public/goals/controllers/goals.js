'use strict';

angular.module('mean.goals')
  .controller('GoalsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.loaded=false;
    $http({method: 'GET', url: '/goals/', xsrfHeaderName: '_csrf'})
      .success(function(data) {
        console.log('Got goals: ', data);
        $scope.goals = data;
        // used to delay loading of the detail view
        $scope.loaded=true;
      })
      .error(function(data) {
        console.log('Err loading goals:', data);
      });
  }]);

angular.module('mean.goals')
  .controller('MyGoalsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.loaded=false;
    $http({method: 'GET', url: '/goals/my'})
      .success(function(data) {
        console.log('Got my goals: ', data);
        $scope.goals = data;
        // used to delay loading of the detail view
        $scope.loaded=true;
      })
      .error(function(data) {
        console.log('Err loading goals:', data);
      });
  }]);

angular.module('mean.goals')
  .controller('GoalCtrl', 
     ['$scope', '$stateParams', '$http', '$state', function($scope, $stateParams, $http, $state) {
    console.log('Looking up goal: ', $stateParams.id);

    $scope.date = (new Date()).toISOString();

    angular.forEach($scope.goals, function(value, key){
       if(value._id===$stateParams.id){
         $scope.goal = value;
         console.log('Found goal: ', $scope.goal);
       }else{
        //redirect or something here
        console.warn('COULD NOT FIND YOUR GOAL');
       }
    });

    $scope.removeGoal = function(){
      console.log('removing goal!');

      $http.delete('/goals/' + $scope.goal._id)
        .success(function(data){
          console.log('removed!');
          $scope.goals.splice( $scope.goals.indexOf($scope.goal), 1 );
          $state.go('^');
        });
    };

    $scope.addProgress = function() {
      console.log('Added goal progress.');

      var postData = {date: $scope.date, number: $scope.number};
      $http.post('/goals/' + $scope.goal._id + '/progress', postData)
        .success(function(data) {
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

      $http.post('/goals/' + $scope.goal._id + '/progress/' + progress_id)
        .success(function(data, status) {
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
        });
    };

    $scope.openPicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  }]);

angular.module('mean.goals')
  .controller('NewGoalCtrl', 
     ['$scope', '$http', '$state', function($scope, $http, $state) {
    console.log('Setting up new goal');

    var now = new Date();
    $scope.date = (new Date(now.getFullYear(), now.getMonth() + 6, 1)).toISOString();

    $scope.addGoal = function() {
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
        .success(function(data) {
          console.log(data);
          // Could just return the 1 progress object but this works for now
          $scope.goals.push(data);
          $state.go('goals.detail', {id: data._id});
        })
        .error(function(){
          console.log('add failed!');
        });
    };
  }]);
