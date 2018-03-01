angular.module('dtApp')
  .factory('AllData', ['$http', function AllDataFactory($http) {
  var url = './sample-data';
  return {
    inst: function() {
      return $http({method: 'GET', url: url + '/cept-instantaneous.json'});
    },
    dai: function() {
      return $http({method: 'GET', url: url + '/365-days.json'});
    },
    wee: function() {
      return $http({method: 'GET', url: url + '/cept-weekly.json'});
    },
    mon: function() {
      return $http({method: 'GET', url: url + '/cept-monthly.json'});
    },
    ene: function() {
      return $http({method: 'GET', url: url + '/energy-dummy.json'});
    },
    enm: function() {
      return $http({method: 'GET', url: url + '/energy-dummy-2.json'});
    },
    sam: function() {
      return $http({method: 'GET', url: 'sample.json'});
    },
  };
}]);
