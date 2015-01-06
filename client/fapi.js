var teamStats = function(){
	console.log('test');
	$.ajax({
		type: "GET",
		url: "http://fantasybballapi.herokuapp.com/allmatchups", 
		dataType: "json",
		success: function(data){
			console.log(data);
			var statMax = getTeamMax("1", "BLK", data);
			chartTeamStatsByCategory(data, 'BLK', "1", statAvg);
		},
		error: function(obj, str, err){
			console.log(str);
		}
	})
}

// LINE GRAPH SECTION
// teamStatsByCategory will add a line
var getTeamMax = function(teamIndex, stat, data){
	teamIndex = teamIndex || "1";
	var max = 0;
	for( var i=0; i<data[teamIndex].length; i++ ){
		if( data[teamIndex][i][stat] > max ){
			max = data[teamIndex][i][stat];
		}
	}
	return max;
}

var weekCount = 10;
var setWidth = 800 / (weekCount+1); // spacing between ticks
var setHeight = 800;

d3.select("#chart") // container is our outer svg element
  .append("svg")
    .attr('width', setWidth)
    .attr('height', setHeight);

var chartTeamStatsByCategory = function(data, stat, teamIndex, statMax){
  console.log( 'making chart' )
  console.log( data )
  var weekIndex;
  var teamData = data[teamIndex] // array of 10 weeks of data

  // set ratio instead of always *setWidthpx // total width is 820px
  // largest row should be 800 px
  // coefficient = 800/mostMade
  var setWidth = 800 / (weekCount+1); // spacing between ticks
  var setHeight = 800;

  // JOIN

  lines = d3.select("#chart").selectAll(".line")
        .data(data)

  // exit
  // console.log(bars.exit())

  // bars.exit()
  //   .style('opacity', 1)
  //   .transition()
  //     .duration(750)
  //     .style('opacity', 0)
  //   .remove()

  // UPDATE
  // lines
  // .transition().duration(500)
  //   .style({
  //     width: function(d) { return (d.shotsMade+d.shotsMissed) * setWidth + "px"; }, }) .select('.madeShots') // shots made
  //     .attr('class', 'madeShots')
  //     .style({
  //       width: function(d) { return d.shotsMade*setWidth + 'px' } }) .select('.text') // text about player and shots
  //     .attr('class','text')
  //     .text(function(d) {
  //       return d.name + ': ' + d.shotsMade+'/'+(d.shotsMissed+d.shotsMade);
  //     })

//ENTER
  var containerBars = bars.enter()
    .append("div") // total shots
      .style('width', '0px')
      .attr("class", 'bar')

    containerBars.transition()
      .duration(750)
      .style({ width: function(d) { return (d.shotsMade+d.shotsMissed) * setWidth + "px"; }, })

}; // end barGraphUpdate();
