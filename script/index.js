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
  
  app.directive('chart', function() {
    return {
      restrict: 'E',
      templateUrl: './templates/directives/chart.html',
      link: function (scope, element, attrs){
        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height"),
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

        d3.csv("./sample-data/365-days.csv", function(error, data) {
          if (error) throw error;
          x.domain(data.map(function(d) { return d.Date; }));
          y.domain([0, d3.max(data, function(d) { return d.Temperature; })]);
          z.domain([d3.min(data, function(d) { return d.Temperature; }), d3.median(data, function(d) { return d.Temperature; }), d3.max(data, function(d) { return d.Temperature; })]);
          
          g.append("g")
            .selectAll("path")
              .data(data)
            .enter().append("path")
              .attr("d", d3.arc()
                .innerRadius(function(d) {return y(0); })
                .outerRadius(function(d) {return y(d.Temperature); })
                .startAngle(function(d) {return x(d.Date); })
                .endAngle(function(d) {return x(d.Date) + x.bandwidth(); }))
              .attr("fill",(function(d) {return z(d.Temperature);}));
          
          var yAxis = g.append("g")
              .attr("text-anchor", "middle");

          var yTick = yAxis
            .selectAll("g")
            .data(y.ticks(5).slice(1))
            .enter().append("g");

          yTick.append("circle")
              .attr("fill", "none")
              .attr("stroke", "rgba(0,0,0,0.2)")
              .attr("stroke-width", "1")
              .attr("r", y);

          yTick.append("text")
              .attr("y", function(d) { return -y(d); })
              .attr("dy", "-0.5em")
              .attr("fill", "rgba(0,0,0,0.4)")
              .text(y.tickFormat(5, "s"));
        });
        
        
        /*
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0);

        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius]);

        d3.csv("./sample-data/365-days.csv", function(d, i, columns) {
          for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
          d.total = t;
          return d;
        }, function(error, data) {
          if (error) throw error;

          x.domain(data.map(function(d) { return d.Date; }));
          y.domain([0, d3.max(data, function(d) { return d.total; })]);

          g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(data.columns.slice(1))(data))
            .enter().append("g")
              .attr("fill", "indianred")
            .selectAll("path")
            .data(function(d) { return d; })
            .enter().append("path")
              .attr("d", d3.arc()
                  .innerRadius(function(d) { return y(d[0]); })
                  .outerRadius(function(d) { return y(d[1]); })
                  .startAngle(function(d) { return x(d.data.Date); })
                  .endAngle(function(d) { return x(d.data.Date) + x.bandwidth(); })
                  .padRadius(innerRadius));

          var label = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
              .attr("text-anchor", "middle")
              .attr("transform", function(d) { return "rotate(" + ((x(d.Date) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });



          var yAxis = g.append("g")
              .attr("text-anchor", "middle");

          var yTick = yAxis
            .selectAll("g")
            .data(y.ticks(5).slice(1))
            .enter().append("g");

          yTick.append("circle")
              .attr("fill", "none")
              .attr("stroke", "#000")
              .attr("r", y);

          yTick.append("text")
              .attr("y", function(d) { return -y(d); })
              .attr("dy", "0.35em")
              .attr("fill", "none")
              .attr("stroke", "#fff")
              .attr("stroke-width", 5)
              .text(y.tickFormat(5, "s"));

          yTick.append("text")
              .attr("y", function(d) { return -y(d); })
              .attr("dy", "0.35em")
              .text(y.tickFormat(5, "s"));

          yAxis.append("text")
              .attr("y", function(d) { return -y(y.ticks(5).pop()); })
              .attr("dy", "-1em")
              .text("Temperature");

          /*
          var legend = g.append("g")
            .selectAll("g")
            .data(data.columns.slice(1).reverse())
            .enter().append("g")
              .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });


          legend.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .attr("fill", z);

          legend.append("text")
              .attr("x", 24)
              .attr("y", 9)
              .attr("dy", "0.35em")
              .text(function(d) { return d; });
              */
        //});
      }
    };
  });
})();