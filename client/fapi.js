var call = function(){
	console.log('test');
	$.get({
			url: "http://fantasybballapi.herokuapp.com/allmatchups", 
			dataType: "jsonp",
			success: function(data){
				console.log(data)
			}
	})
}

// BAR GRAPH SECTION

var barGraphUpdate = function(data){
  var bars;
  // set ratio instead of always *setWidthpx // total width is 820px
  // largest row should be 800 px
  // coefficient = 800/mostMade
  console.log( data )
  var setWidth = 800 / (data[0].shotsMade + data[0].shotsMissed);


  // JOIN

  bars = d3.select("#chart").selectAll(".bar")
        .data(data)

  // exit
  console.log(bars.exit())
  bars.exit()
    .style('opacity', 1)
    .transition()
      .duration(750)
      .style('opacity', 0)
    .remove()

  // UPDATE
  bars
  .transition().duration(500)
    .style({
      width: function(d) { return (d.shotsMade+d.shotsMissed) * setWidth + "px"; }, }) .select('.madeShots') // shots made
      .attr('class', 'madeShots')
      .style({
        width: function(d) { return d.shotsMade*setWidth + 'px' } }) .select('.text') // text about player and shots
      .attr('class','text')
      .text(function(d) {
        return d.name + ': ' + d.shotsMade+'/'+(d.shotsMissed+d.shotsMade);
      })

//ENTER
  var containerBars = bars.enter()
    .append("div") // total shots
      .style('width', '0px')
      .attr("class", 'bar')

  // var shotsMadeBars = containerBars.append('div')
  //     .style('width', '0px')
  //     .attr('class', 'madeShots')


  // var textBars = shotsMadeBars.append('div')
  //     .style('opacity', 0)
  //     .attr('class','text')
  //       .text(function(d) {
  //         return d.name + ': ' + d.shotsMade+'/'+(d.shotsMissed+d.shotsMade);
  //       })

    containerBars.transition()
      .duration(750)
      .style({ width: function(d) { return (d.shotsMade+d.shotsMissed) * setWidth + "px"; }, })
    // shotsMadeBars.transition()
    //   .duration(500)
    //   .style({ width: function(d) { return d.shotsMade*setWidth + 'px' } })
    // textBars.transition()
    //   .duration(500)
    //   .style('opacity', 1)

        

}; // end barGraphUpdate();
