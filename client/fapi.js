var call = function(){
	$.get({
	  url:"http://fantasysports.yahooapis.com/fantasy/v2/game/nba", 
	  success: function(data){
	  	cosole.log('in success');
	    console.log(data);
	  },
	  error: function(data){
	  	console.log('in error')
	  }

	})
}