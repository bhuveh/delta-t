angular.module('dtApp')
  .config(function($routeProvider){
    /* Empty */
    $routeProvider.when('/', {
      redirectTo: '/login'
    })
    /* Login */
    .when('/login', {
      templateUrl: './templates/pages/login.html'  
    })
    /* Home */
    .when('/home', {
      templateUrl: './templates/pages/home.html'  
    })
    /* Main Menu */
    .when('/info', {
      templateUrl: './templates/pages/info.html'  
    })
    .when('/vote', {
      templateUrl: './templates/pages/vote.html'  
    })
    .when('/acqn', {
      templateUrl: './templates/pages/acqn.html'  
    })
    .when('/expt', {
      templateUrl: './templates/pages/expt.html'  
    })
    .when('/read', {
      templateUrl: './templates/pages/read.html'  
    })
    /* Sub Menu */
    .when('/edit-info', {
      templateUrl: './templates/pages/edit-info.html'  
    })
    .when('/edit-logg', {
      templateUrl: './templates/pages/edit-logg.html'  
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
    .otherwise( { redirectTo: '/home' });
});