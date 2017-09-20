(function(){
  var app = angular.module('dtApp', [ ]);
  
  app.controller('DTController', ['$scope', function($scope) {
    $scope.coordinators = ['#0001','#0002','#0003'];
  }]);
})();