var matchupResults = {};
var buildChart = function(data, stat_id){
    $(function () {
        var categories = []; // populate with each Team Name
        var series = []; // one series for each stat, name and data array
        var teamNames = Object.keys(data);
        var statValues = [];
        teamNames.forEach(function(teamName, idx) {
            categories.push(teamName);
            var teamResults = data[teamName]['week1'];
            statValues.push(teamResults[stat_id]);
        });
        var series = [{
            name: stat_id,
            data: statValues,
        }];
        // [{
        //     name: 'Tokyo',
        //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        //
        // }, {
        //     name: 'New York',
        //     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
        //
        // }, {
        //     name: 'London',
        //     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
        //
        // }, {
        //     name: 'Berlin',
        //     data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        //
        // }]

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: categories,
                // categories: [
                //     'FG%',
                //     'FT%',
                //     '3PTM',
                //     'PTS',
                //     'OREB',
                //     'REB',
                //     'AST',
                //     'STL',
                //     'BLK'
                // ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: series,
            // series: [{
            //     name: 'Tokyo',
            //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            //
            // }, {
            //     name: 'New York',
            //     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            //
            // }, {
            //     name: 'London',
            //     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
            //
            // }, {
            //     name: 'Berlin',
            //     data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
            //
            // }]
        });
    });
}
console.log(data);
console.log('inside , got data');
var weekStats = function(){
    buildChart(data, 'AST');
    return true;
	$.ajax({
		type: "GET",
		url: "/getMatchups",
		dataType: "json",
		success: function(data){
			console.log(data);
			matchupResults = data;
            buildChart(data);
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
    console.log('ready');
    weekStats();
})
