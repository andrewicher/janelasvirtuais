var weather = {
	SQL:"http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid=449704 and u=\"c\"&format=json",
	container:null,
	forecast:new Array(),
	conditions:[
			"tornado",
			"tempestade tropical",
			"furacão",
			"tempestades severas",
			"tempestades",
			"chuva e neve",
			"chuva e granizo",
			"neve e granizo",
			"chuvisco gelado",
			"garoa",
			"chuva congelante",
			"chuva",
			"chuva",
			"flocos de neve",
			"chuva com neve",
			"vento com neve",
			"neve",
			"granizo",
			"granizo",
			"vento seco",
			"nebuloso",
			"haze",
			"smoky",
			"tempestade de vento",
			"ventoso",
			"frio",
			"nublado",
			"nublado",
			"nublado",
			"parcialmente nublado",
			"parcialmente nublado",
			"céu limpo",
			"ensolarado",
			"limpo",
			"limpo",
			"chuva e granizo",
			"quente",
			"trovoadas isoladas",
			"trovoadas",
			"trovoadas",
			"chuvas esparsas",
			"neve",
			"chuva e neve",
			"neve",
			"céu limpo",
			"trovoadas",
			"aguaceiros de neve",
			"trovoadas isoladas"],
	icons: [
		'storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail',
		'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow',
		'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake',
		'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun',
		'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain',
		'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'
	],
	init: function(obj){
		weather.container=$(".container");
		console.log(weather.container);
		setTimeout(function(){ weather.start()},100);
	},
	start:function(){
		setTimeout(function() {
			weather.updateFeed()
		}, 100);
	},
	updateFeed:function(){
		$.getJSON(weather.SQL, function(e){
			weather.forecast.push(e.query.results.channel.item.condition);
			weather.forecast.push(e.query.results.channel.item.forecast[0]);
			weather.forecast.push(e.query.results.channel.item.forecast[1]);
			setTimeout(function(){weather.translate()},100);
		});
	},
	translate:function(){
		for(i=0;i<weather.forecast.length;i++){
			var code = weather.forecast[i].code;
			weather.forecast[i].text=weather.conditions[code];
			weather.forecast[i].date = new Date(weather.forecast[i].date);
		}
		setTimeout(function(){weather.render()},100);
	},
	render:function(){
	console.log(weather.forecast);
		var wrapper = $('<div>').addClass('wrapper');
		var today = $('<div>').addClass('today');
		var forecast = $('<div>').addClass('forecast');
		var clock = $('<div>').addClass('forecast');
		today.append(
			$('<div>').html('Tempo hoje').addClass('day')
			).css('background','url("./assets/img/icons/'+weather.icons[weather.forecast[0].code]+'.png") no-repeat left center').css('background-size','200px 142px').css('background-color','rgba(255,255,255,0.1)').append(
			$('<div>').addClass('text').html(weather.forecast[0].text)
			).append(
			$('<div>').addClass('temperature').html("agora: "+weather.forecast[0].temp+'ºC')
			).append(
			$('<div>').addClass('temperature').html("máx: "+weather.forecast[1].high+'ºC')
			).append(
			$('<div>').addClass('temperature').html("min: "+weather.forecast[1].low+'ºC')
			);
		forecast.append(
			$('<div>').html('Amanhã').addClass('day')
			).css('background','url("./assets/img/icons/'+weather.icons[weather.forecast[2].code]+'.png") no-repeat left center').css('background-size','200px 142px').css('background-color','rgba(255,255,255,0.2)').append(
			$('<div>').addClass('text').html(weather.forecast[2].text)
			).append(
			$('<div>').addClass('temperature').html("máx: "+weather.forecast[2].high+'ºC')
			).append(
			$('<div>').addClass('temperature').html("min: "+weather.forecast[2].low+'ºC')
			);			
		clock.append($('<iframe>').attr('src','../clock/widget.svg'));
			
		wrapper.append(clock).append(today).append(forecast);
		weather.container.append(wrapper);
	}
}
setTimeout(function(){
weather.init();
},1000);