var d3 = require('d3')


var DEFAULTS = {
  margin: {
    top: 10, 
    right:10, 
    bottom:25, 
    left: 25,
  }, 
  dimensions:{
    height: 300,
    width: 400
  }, 
  colors:{
    color: ["#031D44", "#255C99", "#718B8C", "#E77245", "#596F62"]
  },
  legend: {
    height: 60,
    width: 50
  },
  title: {
    graphTitle: "",
    size: "20px",
    color: "#222",
  }
}
function stackedHistogram(options){
  var settings;
  
  if(arguments.length == 1)
    settings= merge(DEFAULTS, options)
  else 
    settings = DEFAULTS

  var height = settings.dimensions.height;
  var width = settings.dimensions.width;
 
  var margin = settings.margin

  var chart = function chart(selection){
    selection.each(function(data){

    var currMax = 0
    var yMax = 0;
    var list = [];
    for(var i = 0; i < data.length; i++){
      if(list.indexOf(data[i].type) == -1)
        list.push(data[i].type)
      if(data[i].y > yMax)
        yMax = data[i].y
    }
    data.sort(function(a, b){
      return b.y - a.y;
    })
    var xScale = d3.scale.ordinal()
      .domain(d3.range(data.length/list.length))
      .rangeRoundBands([margin.left, width - margin.left-margin.right], .05);
    

    var yScale = d3.scale.linear()
      .domain([0, yMax + 5])
      .range([height- margin.top-margin.bottom, margin.bottom]);

    var svg = d3.select(this).selectAll("svg").data([data]).enter().append("svg")
    svg.attr("width", width).attr("height", height)

    var group = svg.append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")")
    

    group.append("g").attr("class", "x axis")
    group.append("g").attr("class", "y axis")
    group.append("g").attr("class", "rects")
    group.append("g").attr("class", "legend")
    group.append("g").attr("class", "title")
   
    svg.attr("width", width).attr("height", height);

    var g = svg.selectAll("g")

   
    var graph = g.select(".rects")
        graph.append("g").attr("class", "bars")
        graph.select(".bars").selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){ 
          return xScale(d.x)})
        .attr("y", function(d){ 
          return yScale(d.y)})
        .attr("height", function(d){ 
          return height - margin.top - margin.bottom - yScale(d.y)})
        .attr("width", xScale.rangeBand())
        .attr("fill", function(d){
          for(var i = 0; i < list.length; i++){
            if(d.type == list[i]) 
              return settings.colors.color[i]
          }})
        

    var legend = g.select(".legend")
    legend.selectAll("rect").data(list)
        .enter()
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", width - margin.right - settings.legend.width-20)
        .attr("y", function(d, i){
           return margin.top + i*17})
        .attr("fill", function(d, i){ 
          return settings.colors.color[i]})
    legend.selectAll("text").data(list)
        .enter()
        .append("text")
        .text(function(d){
          return d})
        .attr("x", width - margin.right - settings.legend.width)
        .attr("y", function(d, i){
          return margin.top + i*15 + 10})
        .attr("font-size", "11px")
        .attr("fill", "#222")


    var title = g.select(".title")
    title.selectAll("text")
        .data([settings.title.graphTitle])
        .enter()
        .append("text")
        .text(settings.title.graphTitle)
        .attr("x", (width)/2)
        .attr("y", margin.top)
        .attr("font-size", settings.title.size)
        .attr("fill", settings.title.color)
        .attr("text-anchor", "middle")
 


    
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
      })

}
  
  
  chart.width = function(value){
    if(!arguments.length) return width;
    width = value;
    return chart
  }

  chart.height = function(value){
    if(!arguments.length) return height
      height = value;
      return chart;
  }

  chart.margin = function(value){
    if(!arguments.length) return margin
    margin = value
  }
  return chart;
}

function merge(defaults, options){
  if(!options.margin)
    options.margin = defaults.margin
  if(!options.dimensions){
    options.dimensions = defaults.dimensions
  }
  if(!options.colors)
    options.colors = defaults.colors
  if(!options.title)
    options.title= defaults.title;
  if(!options.legend)
    options.legend = defaults.legend
  return options
  
}
module.exports = stackedHistogram;