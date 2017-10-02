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
    .otherwise( { redirectTo: '/' });
});