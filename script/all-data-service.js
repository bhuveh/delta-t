angular.module('dtApp')
  .factory('AllData', ['$http', function AllDataFactory($http) {
  var url = './sample-data';
  return {
    inst: function() {
      return $http({method: 'GET', url: url + '/cept-instantaneous.json'});
    },
    dai: function() {
      return $http({method: 'GET', url: url + '/cept-daily.json'});
    },
    wee: function() {
      return $http({method: 'GET', url: url + '/cept-weekly.json'});
    },
    mon: function() {
      return $http({method: 'GET', url: url + '/cept-monthly.json'});
    },
    sam: function() {
      return $http({method: 'GET', url: 'sample.json'});
    },
  };
}]);
