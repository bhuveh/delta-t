(function(){
  var app = angular.module('dtApp', [ 'ngRoute', 'rzModule' ]);
  
  app.controller('DTController', ['$scope', function($scope) {
    $scope.coordinators = ['0001','0002','0003'];
    
    $scope.id = '';
    $scope.setID = function(id){
      $scope.id = id;
      //console.log('ID set to ' + id);
    };
    
    $scope.sidebar = false;
    $scope.toggleSidebar = function() {
      $scope.sidebar = !$scope.sidebar;
    }
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
  }]);
  
  app.controller('VoteController', ['$scope', function($scope) {
    $scope.slider = {
      val: 0,
      opt: {
        floor: -300,
        ceil: 300,
        step: 1,
        vertical: true,
        translate: function(value) {
          return value/100;
        },
        showTicks: 100,
        getLegend: function(value) {
          if(value==-300)
            return 'Cold';
          if(value==-200)
            return 'Cool';
          if(value==-100)
            return 'Slightly Cool';
          if(value==0)
            return 'Neutral';
          if(value==100)
            return 'Slightly Warm';
          if(value==200)
            return 'Warm';
          if(value==300)
            return 'Hot';
          return null;
        },
      }
    };
  }]);
  
  app.directive('login', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/login.html'
    };
  });
  
  app.directive('topbar', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/topbar.html'
    };
  });
  
  app.directive('sidebar', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/sidebar.html',
      controller: 'SidebarController',
      scope: {
        id: '@'
      }
    };
  });
})();