angular.module('dtApp')
  .config(function($routeProvider){
    $routeProvider.when('/', {
      redirectTo: '/login'
    })
    .when('/login', {
      templateUrl: './templates/pages/login.html'  
    })
    .when('/home', {
      templateUrl: './templates/pages/home.html'  
    })
    .when('/vote', {
      templateUrl: './templates/pages/vote.html'  
    })
    .when('/bill', {
      templateUrl: './templates/pages/bill.html'  
    })
    .when('/cdata', {
      templateUrl: './templates/pages/cdata.html'  
    })
    .when('/idata', {
      templateUrl: './templates/pages/idata.html'  
    })
    .when('/edata', {
      templateUrl: './templates/pages/edata.html'  
    })
    .when('/plan', {
      templateUrl: './templates/pages/plan.html'  
    })
    .otherwise( { redirectTo: '/' });
});