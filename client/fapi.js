var buildChart = function(data, stat_id){
    $(function () {
        var series = []; // one series for each stat, name and data array
        var teamNames = Object.keys(data);
        var statValues = [];
        var weeks = Object.keys(data[teamNames[0]]);
        weeks.map(function(week, idx){
            // create series object for this week
            series.push({
                name: 'Week' + (idx + 1),
                // all week 1 values
                data: teamNames.map(function(teamName){
                    return parseFloat(data[teamName][week][stat_id]);
                }),
            })
        });

        // http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/column-basic/
        Highcharts.chart(stat_id, {
            chart: {
                type: 'column'
            },
            title: {
                text: stat_id,
            },
            subtitle: {
                text: '',
            },
            xAxis: {
                categories: teamNames,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: stat_id,
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
        });
    });
}

$(document).on('ready', function(){
    console.log('ready');
    $.ajax({
		type: "GET",
		url: "/getMatchups",
		dataType: "json",
		success: function(data){
            console.log('got data');
console.log(data);
            var teamName = Object.keys(data)[0];
            var weekNum = Object.keys(data[teamName])[0];
            var categories = Object.keys(data[teamName][weekNum]);

            categories.forEach(function(category){
                if (category.indexOf('FGMA') >= 0) return;
                if (category.indexOf('FTMA') >= 0) return;
                buildChart(data, category);
            })
		},
		error: function(obj, str, err){
			console.log(str);
		}
	})

})
