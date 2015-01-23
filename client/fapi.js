// 
var matchupResults = {};
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
var getTeamMax = function(teamIndex, stat, data){
  // debugger;
	teamIndex = teamIndex || "1";
	var max = 0;
	for( var i=0; i<data[teamIndex].length; i++ ){
    var currentValue = data[teamIndex][i][stat];
		if( parseInt(currentValue) > parseInt(max) ){
			max = data[teamIndex][i][stat];
		}
	}
	return max;
};


// //add svg element
var width = 800;
var height = 600;
// d3.select('#chart')
//   // .append('svg')
//     .attr('width', width)
//     .attr('height', height)


//allocate space for n number of weeks
var weekCount = fantasyContent[1].length;
var xwidth = 800 / weekCount;
console.log("x: "+xwidth);
// take 15% of this for padding on each side
var xPadding = 0.3*xwidth;
var barWidth = xwidth - 2*xPadding;


var addTeamToChart = function(teamIndex, stat){
  // var $g = $("svg").attr('xmlns', "http://www.w3.org/2000/svg").append('<g>')
  var team = fantasyContent[teamIndex];
  var bars = d3.select('#chart').selectAll('.bar').data(team);
  bars.exit().remove()
  // scale the max of the current stat to the height of 600;
  var max = getTeamMax(teamIndex, stat, fantasyContent);
  var scale = function(max, val){
    console.log("line63, inside scale",max)
    return (val/max)*600;
  }
  bars.enter()
    .append("div") // total shots
      .attr("class", 'bar')
      .style("width", barWidth+"px")
      .style("height", function(d) { 
        // console.log(d[stat]);
        // console.log(scale(max, d[stat]));
        return (scale(max, d[stat])+"px"); })
      .style("left", function(d, i){ return i*xwidth +"px"; })
      .style("top", function(d, i){ return height - scale(max, d[stat])+"px"})
  bars.transition().duration(100) // total shots
    .attr("class", 'bar')
    .style("padding-left", xPadding)
    .style("padding-right", xPadding)
    .style("width", barWidth+"px")
    // .transition.duration(125)
    .style("height", function(d) { 
      return (scale(max, d[stat])+"px"); })
    .style("left", function(d, i){ return i*xwidth +"px"; })
    .style("top", function(d, i){ return height - scale(max, d[stat])+"px"})


  // $("#chart").html($("#chart").html());
}

addTeamToChart(1, "PTS");
$("#chart").on('click', '.bar', function(){
  console.log($(this).style('height'))
})

var chartTeamStatsByCategory = function(data, stat, teamIndex, statMax){
  console.log( 'making chart' )
  console.log( data )
  var weekIndex;
  var teamData = data[teamIndex] // array of 10 weeks of data

  // set ratio instead of always *setWidthpx // total width is 820px
  // largest row should be 800 px
  // coefficient = 800/mostMade
  var widthInterval = 800 / (weekCount+1); // spacing between ticks
  var setHeight = 800;

  // JOIN

  lines = d3.select("#chart").selectAll(".line")
        .data(data)

  // exit
  // console.log(bars.exit())

  lines.exit()
    .style('opacity', 1)
    .transition()
      .duration(750)
      .style('opacity', 0)
    .remove()

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

}; // end chartTeamStatsByCategory();


