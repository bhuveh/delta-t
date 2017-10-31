(function(){
  var app = angular.module('dtApp', [ 'ngRoute', 'rzModule' ]);
  
  app.controller('DTController', ['$scope', 'AllData', '$window', function($scope, AllData, $window) {
    $scope.coordinators = ['0001','0002','0003'];
    
    $scope.id = '';
    $scope.setID = function(id){
      $scope.id = id;
      //console.log('ID set to ' + id);
      AllData.dai()
        .then(function(response){
          $scope.dData = response.data;
        }, function(response){
          console.log('Error');
      });
    };
    
    $scope.sidebar = false;
    $scope.toggleSidebar = function() {
      $scope.sidebar = !$scope.sidebar;
    };
    
    $scope.clickButton = function(button) {
      if(button=='vote') {
        $window.alert('Your vote has been submitted! Thanks for voting!');
      } else if(button=='addBill') {
        $window.alert('Bill details have been registered.');
      }
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
          console.log('Value Changed.');
          renderChart();
        }, true);
        
        scope.msg = 0;
        
        scope.click = function(t) {
          scope.msg++;
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
})();