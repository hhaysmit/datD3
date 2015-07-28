var d3 = require('d3'),
    merge = require('merge')

module.exports = stackedHistogram;


function stackedHistogram(options){
  
  var DEFAULTS = {
      margin: {
        top: 10, 
        right:10, 
        bottom:25, 
        left: 25,
      }, 
      height: 300,
      width: 400, 
      color: ["#031D44", "#255C99", "#718B8C", "#E77245", "#596F62"],
      legend: {
        height: 60,
        width: 50,
      },
      title: {
        graphTitle: "",
        size: "20px",
        color: "#222",
      }
  }

  options = merge.recursive(true, {}, DEFAULTS, options || {});

  var height = options.height,
      width = options.width,
      margin = options.margin,
      x = options.xValue,
      y = options.yValue,
      type = options.typeValue;

  var chart = function chart(selection){
    
    selection.each(function(data){
        var yMax = 0,
            list = [];
        for (var i = 0; i < data.length; i++){
            if(list.indexOf(chart.type()(data[i])) == -1)
              list.push(chart.type()(data[i]))
            if (chart.y()(data[i]) > yMax)
              yMax = chart.y()(data[i])
          };
        
        data.sort(function(a, b) {
          return chart.y()(b) - chart.y()(a);
        })

        var xScale = d3.scale.ordinal()
            .domain(d3.range(data.length/2))
            .rangeRoundBands([margin.left, width - margin.left-margin.right], .05);
    

        var yScale = d3.scale.linear()
            .domain([0, yMax + 5])
            .range([height- margin.top-margin.bottom, margin.bottom]);

        var svg = d3.select(this)
            .selectAll("svg")
            .data([data])
            .enter()
            .append("svg");
    
        svg.attr("width", width)
           .attr("height", height)

        var group = svg.append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")")
        group.append("g").attr("class", "x axis")
        group.append("g").attr("class", "y axis")
        group.append("g").attr("class", "rects")
        group.append("g").attr("class", "legend")
        group.append("g").attr("class", "title")
   
        svg.attr("width", width)
            .attr("height", height);

        var g = svg.selectAll("g")

        var graph = g.select(".rects")
            graph.append("g").attr("class", "bars")
            graph.select(".bars").selectAll("rect")
            .data(function(d) {return d; })
            .enter()
            .append("rect")
            .attr("x", function(d){ 
                return xScale(chart.x()(d))})
            .attr("y", function(d){ 
                return yScale(chart.y()(d))})
            .attr("height", function(d){ 
                return height - margin.top - margin.bottom - yScale(chart.y()(d))})
            .attr("width", xScale.rangeBand())
            .attr("fill", function(d){
                for(var i = 0; i < list.length; i++){
                  if(chart.type()(d) == list[i]){
                    return options.color[i]
                  }
                }
                });
        

        var legend = g.select(".legend")
        legend.selectAll("rect")
            .data(list)
            .enter()
            .append("rect")
            .attr({
              width: 15,
              height: 15,
              x: width - margin.right - options.legend.width-20,
              y: function(d, i) { return margin.top + i*17},
              fill: function(d, i) { return options.color[i]}
            });
        
        legend.selectAll("text")
            .data(list)
            .enter()
            .append("text")
            .text(function(d){
                return d})
            .attr({
              x: width - margin.right - options.legend.width,
              y: function(d, i){ return margin.top + i*15 + 10},
              "font-size": "11px",
              "fill": "#222"
            });


        var title = g.select(".title")
        title.selectAll("text")
            .data([options.title.graphTitle])
            .enter()
            .append("text")
            .text(options.title.graphTitle)
            .attr({
              x: width/2,
              y: margin.top,
              "font-size": options.title.size,
              "fill": options.title.color,
              "text-anchor": "middle"
            });
 
        xAxis = d3.svg.axis()
        xAxis.scale(xScale)
            .orient("bottom")
            .ticks(5);
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

        g.select(".x.axis")
            .attr("transform", "translate(" +[0, height - margin.top-margin.bottom] + ")")
            .call(xAxis)
        g.select(".y.axis")
            .attr("transform", "translate("+ margin.left + ", 0)")
            .call(yAxis);
      });

}
  
  
  chart.width = function(value){
      if (!arguments.length) return width;
      width = value;
      return chart
  };

  chart.height = function(value){
      if (!arguments.length) return height;
      height = value;
      return chart;
  };

  chart.margin = function(value){
      if (!arguments.length) return margin;
      margin = value
      return chart;
  };

  chart.x = function(getter) {
      if (!arguments.length) return x;
      x = getter;
      return chart;
    };

  chart.y = function(getter) {
      if (!arguments.length) return y;
      y = getter;
      return chart;
    };

  chart.type = function(getter) {
      if (!arguments.length) return type;
      type = getter;
      return chart;
  };

  return chart;
}


