var matchupResults = {};
var addTeamToChart = function(){
  return
}
//ajax request to get all matchup results. all teams and all weeks
var teamStats = function(){
	console.log('test');
	$.ajax({
		type: "GET",
		url: "http://fantasybballapi.herokuapp.com/allmatchups", 
		dataType: "json",
		success: function(data){
			console.log(data);
			matchupResults = data;

			// var statMax = getTeamMax("1", "BLK", data);
			// chartTeamStatsByCategory(data, 'BLK', "1", statAvg);
		},
		error: function(obj, str, err){
			console.log(str);
		}
	})
};

// BAR GRAPH SECTION

// fantasyContent is an object containing a property index for each team, 1-12


//this will print scoring totals from week 9
$(document).on('ready', function(){
  var week = 9;
  var stat = "PTS";
  var height = 500

  var svg = d3.select('svg')
    .attr({
      width: 500,
      height: height
    })
  var teamCount = Object.keys(fantasyContent);
  var data = [];
  function getData(){
    $.each(teamCount, function(team, i){
      data.push(fantasyContent[team+1][week][stat])
    });
    data.sort(function(a,b){
      return b-a;
    })
  }
  getData();

  var teamData = [];
  var weekCount = [0,1,2,3,4,5,6,7,8,9]
  function getTeamByWeek(teamIndex){
    $.each(weekCount, function(week, i){
      console.log(week)
      teamData.push(fantasyContent[teamIndex][week][stat])
    })
  }
  getTeamByWeek(1);
  console.log(data)
  // now data is an array of points
  var line = d3.svg.line()
    .x(function(d,i){ return xScale(i)})
    .y(function(d,i){return yScaleLine(d)})


  var maxScore = d3.max(teamData)
  var yScale = d3.scale.linear()
    .domain([0, maxScore])
    .range([0,height])

  var yScaleLine = d3.scale.linear()
    .domain([0, maxScore])
    .range([height,0])

  var xScale = d3.scale.ordinal()
    .domain(d3.range(teamData.length))
    .rangeBands([0,500], 0.7)

  var axis = d3.svg.axis()
    .scale(yScaleLine)
    .orient("right")
    .ticks(4)
    // .tickValues([100, 200, 300, 400, 500])

  var g = svg.append('g')
  axis(g);
    g.attr("transform", "translate(0, 0)");
    g.selectAll("path")
      .style({fill: "none", stroke: "#000"})
    g.selectAll("line")
      .style({stroke: "#000"})


  g.append("path")
    .attr("d", line(teamData))
    .style({
      fill: "none",
      stroke: "#000"
    })

  var rectangles = g.selectAll("rect")
    .data(teamData);

  rectangles.enter()
    .append("rect")
    .attr({
      width: xScale.rangeBand(),
      height: function(d,i){ return yScale(d)},
      x: function(d,i){ return xScale(i)},
      y: function(d,i){ return height-yScale(d)}
    })
    .on('mouseover', function(d){
      console.log(d)
    })

})
