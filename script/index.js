(function(){
  var app = angular.module('dtApp', [ 'ngRoute', 'rzModule' ]);
  
  app.controller('DTController', ['$scope', 'AllData', '$window', function($scope, AllData, $window) {
    $scope.user = {};
    $scope.user.fname = "Old Name";
    $scope.user.lname = "Old Name";
    $scope.user.address = "Old Address";
    
    
    $scope.setID = function(username){
      if(username == 'researcher') {
        $scope.user.id = '007';
        $scope.user.flag = 1;
      } else {
        $scope.user.id = '001';
        $scope.user.flag = 0;
      }

      AllData.dai()
        .then(function(response){
          $scope.dData = response.data;
        }, function(response){
          console.log('Error');
      });
      AllData.ene()
        .then(function(response){
          $scope.eData = response.data;
        }, function(response){
          console.log('Error');
        });
      };
    
    $scope.sidebar = false;
    $scope.toggleSidebar = function() {
      $scope.sidebar = !$scope.sidebar;
    };
    
    $scope.sidebarButton = 0;
    $scope.setSidebarButton = function(button) {
      $scope.sidebarButton = button;
    };
    $scope.isButton = function(button) {
      return $scope.sidebarButton == button;
    };
    
    $scope.clickButton = function(button) {
      if(button=='vote') {
        $window.alert('Your vote has been submitted! Thanks for voting!');
      } else if(button=='addBill') {
        $window.alert('Bill details have been registered.');
      } else if(button=='saveInfo') {
        $window.alert('User & site details have been updated!');
      }
    }
  }]);
  
  app.controller('VoteController', ['$scope', function($scope) {
    $scope.slider = {
      val: 0,
      opt: {
        floor: -400,
        ceil: 400,
        step: 1,
        vertical: true,
        hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function(value) {
          return value/100;
        },
        showTicks: 100,
        getLegend: function(value) {
          if(value==-400)
            return 'Very Cold';
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
          if(value==400)
            return 'Very Hot';
          return null;
        },
      }
    };
  }]);
  
  app.controller('InstaController', ['$scope', function($scope) {
    
    var sliderVal = ($scope.temp * 16) - 400;
    
    $scope.slider = {
      val: sliderVal,
      opt: {
        floor: -400,
        ceil: 400,
        step: 1,
        vertical: true,
        hidePointerLabels: true,
        hideLimitLabels: true,
        readOnly: true,
        showTicks: 100,
        getLegend: function(value) {
          if(value==-400)
            return 'Very Cold';
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
          if(value==400)
            return 'Very Hot';
          return null;
        },
      }
    };
    
    $scope.getColorT = function(val) {
      if (val < 3.125) {
        return '#0002a1';
      } else if (val < 9.375) {
        return '#0120d8';
      } else if (val < 15.625) {
        return '#0374ff';
      } else if (val < 21.875) {
        return '#00ffff';
      } else if (val < 28.125) {
        return '#3aff03';
      } else if (val < 34.375) {
        return '#ffff00';
      } else if (val < 40.625) {
        return '#ff8800';
      } else if (val < 46.875) {
        return '#d61010';
      } else {
        return '#7c0616';
      }
    };
    $scope.getColorH = function(val) {
      if (val < 6.25) {
        return '#0002a1';
      } else if (val < 18.750) {
        return '#0120d8';
      } else if (val < 31.250) {
        return '#0374ff';
      } else if (val < 43.750) {
        return '#00ffff';
      } else if (val < 56.250) {
        return '#3aff03';
      } else if (val < 68.750) {
        return '#ffff00';
      } else if (val < 81.250) {
        return '#ff8800';
      } else if (val < 93.750) {
        return '#d61010';
      } else {
        return '#7c0616';
      }
    };

    $('#temp-box').css('color', $scope.getColorT($scope.temp));
    $('#hum-box').css('color', $scope.getColorH($scope.hum));
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
      templateUrl: './templates/directives/sidebar.html'
    };
  });
  
  app.directive('chart', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/chart.html',
      controller: function($scope, AllData) {
        AllData.mon()
        .then(function(response){
          $scope.mData = response.data;
        }, function(response){
          console.log('Error');
        });
        AllData.wee()
        .then(function(response){
          $scope.wData = response.data;
        }, function(response){
          console.log('Error');
        });
      },
      scope: {
        type: '=',
        data: '='
      },
      link: function (scope, element, attrs){
        scope.dData = scope.data;
        
        scope.$watch('type', function(newVal, oldVal) {
          //console.log('Value Changed.');
          renderChart();
        }, true);
        
        scope.click = function(t) {
          scope.type = t;
        };
        
        var renderChart = function() {
          var svg = d3.select("svg");
          
          svg.selectAll("*").remove()
          
          var width = 500,
            height = 500,
            innerRadius = 60,
            outerRadius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
          var x = d3.scaleBand()
              .range([0, 2 * Math.PI])
              .align(0.5);

          var y = d3.scaleRadial()
              .range([innerRadius, outerRadius])
              .nice();

          var z = d3.scaleLinear()
              .range(['#e5918d','#da635d', '#984541']);

          if (scope.type=='daily') {          
            x.domain((scope.dData).map(function(d) { return d.date; }));
            y.domain([0, d3.max((scope.dData), function(d) { return d.temp; })]);       
            z.domain([d3.min((scope.dData), function(d) { return d.temp; }), d3.median((scope.dData), function(d) { return d.temp; }), d3.max((scope.dData), function(d) { return d.temp; })]);

            g.append("g")
            .selectAll("path")
              .data((scope.dData))
            .enter().append("path")
              .attr("d", d3.arc()
                .innerRadius(function(d) {return y(0); })
                .outerRadius(function(d) {return y(d.temp); })
                .startAngle(function(d) {return x(d.date); })
                .endAngle(function(d) {return x(d.date) + x.bandwidth(); }))
              .attr("fill",(function(d) {return z(d.temp);}));
          }
          else if (scope.type=='weekly') {
            x.domain((scope.wData).map(function(d) { return d.week; }));
            y.domain([0, d3.max((scope.wData), function(d) { return d.temp; })]);       
            z.domain([d3.min((scope.wData), function(d) { return d.temp; }),   d3.median((scope.wData), function(d) { return d.temp; }), d3.max((scope.wData), function(d) { return d.temp; })]);

            g.append("g")
            .selectAll("path")
              .data((scope.wData))
            .enter().append("path")
              .attr("d", d3.arc()
                .innerRadius(function(d) {return y(0); })
                .outerRadius(function(d) {return y(d.temp); })
                .startAngle(function(d) {return x(d.week); })
                .endAngle(function(d) {return x(d.week) + x.bandwidth(); }))
              .attr("fill",(function(d) {return z(d.temp);}));
          }
          else if (scope.type=='monthly') {
            x.domain((scope.mData).map(function(d) { return d.month; }));
            y.domain([0, d3.max((scope.mData), function(d) { return d.temp; })]);      
            z.domain([d3.min((scope.mData), function(d) { return d.temp; }), d3.median((scope.mData), function(d) { return d.temp; }), d3.max((scope.mData), function(d) { return d.temp; })]);

            g.append("g")
            .selectAll("path")
              .data((scope.mData))
            .enter().append("path")
              .attr("d", d3.arc()
                .innerRadius(function(d) {return y(0); })
                .outerRadius(function(d) {return y(d.temp); })
                .startAngle(function(d) {return x(d.month); })
                .endAngle(function(d) {return x(d.month) + x.bandwidth(); }))
              .attr("fill",(function(d) {return z(d.temp);}));
            

          }
          else {
            console.log('Loading...');
          }

          var yAxis = g.append("g")
            .attr("text-anchor", "middle");

          var yTick = yAxis
          .selectAll("g")
          .data(y.ticks(4).slice(1))
          .enter().append("g");

          yTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "rgba(0,0,0,0.2)")
            .attr("stroke-width", "1")
            .attr("r", y);

          yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "-0.4em")
            .attr("fill", "rgba(0,0,0,0.2)")
            .text(y.tickFormat(5, "s"));
        };
      }
    };
  });
  
  app.directive('eChart', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/e-chart.html',
      controller: function($scope, AllData) {
        AllData.enm()
        .then(function(response){
          $scope.mData = response.data;
        }, function(response){
          console.log('Error');
        });
      },
      link: function (scope, element, attrs){
        
        scope.click = function(data) {
          renderChart(data);
        };
        
        var renderChart = function(data) {          
          var svg = d3.select("svg");
          
          svg.selectAll("*").remove()
          
          var width = 500,
            height = 500,
            innerRadius = 60,
            outerRadius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
          var x = d3.scaleBand()
              .range([0, 2 * Math.PI])
              .align(0.5);

          var y = d3.scaleRadial()
              .range([innerRadius, outerRadius])
              .nice();

          var z = d3.scaleLinear()
              .range(['#e5918d','#da635d', '#984541']);

          x.domain((data).map(function(d) { return d.month; }));
          y.domain([0, d3.max((data), function(d) { return d.energy; })]);      
          z.domain([d3.min((data), function(d) { return d.energy; }), d3.median((data), function(d) { return d.energy; }), d3.max((data), function(d) { return d.energy; })]);

          g.append("g")
          .selectAll("path")
            .data((data))
          .enter().append("path")
            .attr("d", d3.arc()
              .innerRadius(function(d) {return y(0); })
              .outerRadius(function(d) {return y(d.energy); })
              .startAngle(function(d) {return x(d.month); })
              .endAngle(function(d) {return x(d.month) + x.bandwidth(); }))
            .attr("fill",(function(d) {return z(d.energy);}));

          var yAxis = g.append("g")
            .attr("text-anchor", "middle");

          var yTick = yAxis
          .selectAll("g")
          .data(y.ticks(4).slice(1))
          .enter().append("g");

          yTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "rgba(0,0,0,0.2)")
            .attr("stroke-width", "1")
            .attr("r", y);

          yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "-0.4em")
            .attr("fill", "rgba(0,0,0,0.2)")
            .text(y.tickFormat(5, "s"));
        };
        renderChart(scope.eData);
      }
    };
  });
  
  app.directive('instData', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/inst-data.html',
      controller: 'InstaController',
      scope: {
        temp: '=',
        hum: '='
      }
    };
  });
  
})();