'use strict';
var d3 = d3 || {};

angular.module('mean.goals')
  .directive('lineChart', [function(){
    function link(scope, el, attr){
      console.log(scope);

      var margin = {top: 20, right: 20, bottom: 60, left: 50},
          width = 700 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

      //https://github.com/mbostock/d3/wiki/Time-Formatting#format_iso
      var parseDate = d3.time.format.utc('%Y-%m-%dT%H:%M:%S.%LZ').parse;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .ticks(d3.time.weeks) //better way?
          .tickFormat(d3.time.format('%b %d'));

      var yTicks = scope.goal.number;
      if (scope.goal.number > 5) {
        yTicks = 5
      }

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .ticks(yTicks)
          .tickSubdivide(0);

      var line = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

      var svg = d3.select(el[0]).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var goalData = [
        {date: parseDate(scope.goal.created), close: 0},
        {date: parseDate(scope.goal.date), close: scope.goal.number}
        ];

      
      x.domain([parseDate(scope.goal.created), parseDate(scope.xmax)]);
      y.domain([0, +scope.ymax]);

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)
          .selectAll('text')
          .style('text-anchor', 'end')
              .attr('dx', '-.8em')
              .attr('dy', '.15em')
              .attr('transform', function(d) {
                  return 'rotate(-65)' ;
                  });

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Goal');

      
      var progress = svg.append('g')
        .attr('class', 'progress');

      svg.append('path')
          .datum(goalData)
          .attr('class', 'line goal')
          .attr('d', line);


      //var progressLine = svg.selectAll('.progress')

      scope.$watch('data', function(data){
        console.log('data changed!');
        
            // using the copy otherwise it actually changes the date for viewing
        data = angular.copy(scope.data);

        data.sort(function(a, b){
          if(a.date > b.date){ return 1; }
          if(a.date < b.date){ return -1; }
          return 0;
        });

        var total = 0;
        data.forEach(function(d) {
          d.date = parseDate(d.date);
          total = total + +d.number;
          d.close = total;
          console.log(total);
        });

        /* Chose to redraw the entire line every time
          This would help with people enter items out of order
          and also help if items are removed from the middle of the list.
          Animations might be difficult to implement 
        */
        progress.selectAll('path').remove();
        progress.selectAll('circle').remove();

        var path = progress.append('path')
          .datum(data)
          .attr('class', 'line progress')
          .attr('d', line);

        var totalLength = path.node().getTotalLength();

        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
            .duration(750)
            .ease('linear')
            .attr('stroke-dashoffset', 0);

        // Append the circles afterwards so they are on top of the line
        progress.selectAll('circle').data(data)
          .enter().append('circle').attr('r', 6)
          .attr('transform', function(d){
            return 'translate(' + [x(d.date), y(d.close)] + ')';
          });

      }, true);
    }
    return {
      link: link,
      restrict: 'E',
      scope: { goal: '=', data: '=', xmax: '=', ymax: '=' }
    };
}]);


/* This was just a test to see if you could put a path inside of a directive
  It actually works quite nice, but there is a lot of code duplicated between
  the two directives.  We could move that to a service possibly.
*/
angular.module('mean.goals')
  .directive('goalLine', [function(){
    function link(scope, el, attr){
      console.log(scope);
      //debugger;

      //var margin = {top: 30, right: 40, bottom: 50, left: 50},
      var margin = {top: 20, right: 20, bottom: 60, left: 50},
          width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

      var parseDate = d3.time.format('%m-%e-%Y').parse;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var goalLine = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

      var svg = d3.select('svg.p');

      var goalData = [
        {date: parseDate(scope.goal.created), close: 0},
        {date: parseDate(scope.goal.date), close: scope.goal.number}
        ];

      
      x.domain([parseDate(scope.goal.created), parseDate(scope.xmax)]);
      y.domain([0, +scope.ymax]);

      svg.append('path')
          .datum(goalData)
          .attr('class', 'line goal')
          .attr('d', goalLine);

    }
    return {
      link: link,
      restrict: 'E',
      scope: { goal: '=', data: '=', xmax: '=', ymax: '=' }
    };
}]);

angular.module('mean.goals')
  .directive('donutChart', [function(){
  function link(scope, el, attr){
    var color = d3.scale.category10();
    var data = scope.data;
    var width = 300;
    var height = 300;
    var min = Math.min(width, height);
    var svg = d3.select(el[0]).append('svg');
    var pie = d3.layout.pie().sort(null);
    var arc = d3.svg.arc()
      .outerRadius(min / 2 * 0.9)
      .innerRadius(min / 2 * 0.5);

    svg.attr({width: width, height: height});
    var g = svg.append('g')
      // center the donut chart
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    
    // add the <path>s for each arc slice
    g.selectAll('path').data(pie(data))
      .enter().append('path')
        .style('stroke', 'white')
        .attr('d', arc)
        .attr('fill', function(d, i){ return color(i); });
  }
  return {
    link: link,
    restrict: 'E',
    scope: { data: '=' }
  };
}]);