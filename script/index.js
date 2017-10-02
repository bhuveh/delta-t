(function(){
  var app = angular.module('dtApp', [ 'ngRoute' ]);
  
  app.controller('DTController', ['$scope', function($scope) {
    $scope.coordinators = ['0001','0002','0003'];
    
    $scope.id = '';
    $scope.setID = function(id){
      $scope.id = id;
      //console.log('ID set to ' + id);
    };
  }]);
  
  app.controller('SidebarController', ['$scope', '$sce', function($scope, $sce) {
    $scope.menu = [
      {
        text: $sce.trustAsHtml('Are You Comfortable? <span class="red">VOTE!</span>'),
        key: 'vote'
      },
      {
        text: $sce.trustAsHtml('Add Electricity Bill'),
        key: 'bill'
      },
      {
        text: $sce.trustAsHtml('View Cumulative Data'),
        key: 'cdata'
      },
      {
        text: $sce.trustAsHtml('View Instantaneous Data'),
        key: 'idata'
      },
      {
        text: $sce.trustAsHtml('Energy Consumption History'),
        key: 'edata'
      },
      {
        text: $sce.trustAsHtml('Location Plan'),
        key: 'plan'
      }
    ];
    
    $scope.activate = function() {
      $('#sidebar').toggleClass('active');
    };
  }]);
  
  app.directive('login', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/login.html'
    };
  });
})();