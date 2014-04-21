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