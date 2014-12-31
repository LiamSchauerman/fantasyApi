var call = function(){
	$.get({
	  url:"http://fantasysports.yahooapis.com/fantasy/v2/league/66969", 
	  success: function(data){
	    console.log(data)
	  }
	})
}