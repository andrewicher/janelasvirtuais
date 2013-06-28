$(function(){
	
	/* Configuração */
	
	var APPID = 'dj0yJmk9MnVIZDBSTmtPeVFRJmQ9WVdrOVVtZFJSMnBKTm04bWNHbzlNVFkxTVRBMU5EWXkmcz1jb25zdW1lcnNlY3JldCZ4PTg2';		// Sua Yahoo APP id
	var DEG = 'c';		// c para celsius, f para fahrenheit
	
	// Mapeando os códigos de tempo retornados pelo API do Yahoo
	// icones da nossa aplicação na pagina img/icons
	
	var weatherIconMap = [
		'storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail',
		'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow',
		'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake',
		'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun',
		'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain',
		'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'
	];
	
	var weatherDiv = $('#weather'),
		scroller = $('#scroller'),
		location = $('p.location');
	
	// Será que seu brownser suporta geolocalização?
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	}
	else{
	    showError("Seu navegador não suporta Geolocalização!");
	}
	
	// Obter a localização do usuário, e usar API PlaceFinder Yahoo 
	// para buscar a localização do usuário, woeid e previsão do tempo
	
	function locationSuccess(position) {
	    var lat = position.coords.latitude;
	    var lon = position.coords.longitude;

	    // Yahoo's PlaceFinder API http://developer.yahoo.com/geo/placefinder/
	    // Estamos passando a R gflag para a geocodificação reversa (coordenadas para colocar nome)
	    var geoAPI = 'http://where.yahooapis.com/geocode?location='+lat+','+lon+'&flags=J&gflags=R&appid='+APPID;
	    
	    // Criando a consulta para Yahoo's weather forecasting API com YQL
	    // http://developer.yahoo.com/weather/
	    
	    var wsql = 'select * from weather.forecast where woeid=WID and u="'+DEG+'"',
	        weatherYQL = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(wsql)+'&format=json&callback=?',
	        code, city, results, woeid;
	    
	    if (window.console && window.console.info){
	    	console.info("Coordenadas: %f %f", lat, lon);
	    }
	    
	    // Emitir um pedido cross-domain de AJAX (CORS) para o serviço de GEO.
	    // Não suportado no Opera e IE
	    $.getJSON(geoAPI, function(r){
	       
	        if(r.ResultSet.Found == 1){
	        	
	            results = r.ResultSet.Results;
	            city = results[0].city;
	            code = results[0].statecode || results[0].countrycode;
	    
	            // Este é o identificador da cidade para a API do tempo
	            woeid = results[0].woeid;
	
	            //Faça um pedido para  Yahoo's weather forecasting API:
	            $.getJSON(weatherYQL.replace('WID',woeid), function(r){
	            	
	                if(r.query && r.query.count == 1){
	                	
	                	//Criar os itens de tempo no #scroller UL
	                	
	                    var item = r.query.results.channel.item.condition;
	                    
	                    if(!item){
	                    	showError("Nós não podemos encontrar informações sobre o tempo da sua cidade!");
	                    	if (window.console && window.console.info){
						    	console.info("%s, %s; woeid: %d", city, code, woeid);
						    }
						    
						    return false;
	                    }
						/*
						Só para constar o YQL, pelo que eu saiba, só retorna informações em inglês.
						Eu vou usar switch para tratar as datas mas não vou tratar as condições climaticas
						Se você quiser trata-las segue um link útil
						http://developer.yahoo.com/weather/
						Confesso que fiquei com preguiça de fazer essa parte lol
						-------------------------------------------------------------
						*/
					
						/*Esse switch abaixo exemplifica como alterar os valores em inglês , no caso ajustando os dias*/
						switch(item.day){
							case 'Sun': var dia = 'Dom';
							break;
							
							case 'Mon': var dia = 'Seg';
							break;
							
							case 'Tue': var dia = 'Ter';
							break;
							
							case 'Wed': var dia = 'Qua';
							break;
							
							case 'Thu': var dia = 'Qui';
							break;
							
							case 'Fri': var dia = 'Sex';
							break;
							
							case 'Sat': var dia = 'Sab';
							break;
							
						}
						
	                    
	                    addWeather(item.code, "Agora", item.text + ' <b>'+item.temp+'°'+DEG+'</b>');
	                    
	                    for (var i=0;i<2;i++){
	                        item = r.query.results.channel.item.forecast[i];
							
	                        addWeather(
	                        	item.code, 
	                        	dia +' <b>'+item.date.replace('\d+$','')+'</b>',
	                        	item.text + ' <b>'+item.low+'°'+DEG+' / '+item.high+'°'+DEG+'</b>'
	                        );
	                    }
	                    
	                    //Adicionando a localização na página
	                    location.html(city+', <b>'+code+'</b>');
	                    
	                    weatherDiv.addClass('loaded');
	                    
	                    // Defina o controle deslizante para o primeiro slide
	                    showSlide(0);
	               
	                }
	                else {
	                    showError("Erro ao recuperar dados meteorológicos!");
	                }
	            });
	    
	        }
	        
	    }).error(function(){
	    	showError("Seu navegador não suporta pedidos CORS!");
	    });
	   
	}
	
	function addWeather(code, day, condition){
		
	    var markup = '<li>'+
	    	'<img src="assets/img/icons/'+ weatherIconMap[code] +'.png" />'+
	    	' <p class="day">'+ day +'</p> <p class="cond">'+ condition +
	    	'</p></li>';
	    
	    scroller.append(markup);
	}
	
	/*funções das setas anterior / próximo */
	
	var currentSlide = 0;
	weatherDiv.find('a.previous').click(function(e){
		e.preventDefault();
		showSlide(currentSlide-1);
	});
	
	weatherDiv.find('a.next').click(function(e){
		e.preventDefault();
		showSlide(currentSlide+1);
	});
	
	
	function showSlide(i){
		var items = scroller.find('li');
		
		if (i >= items.length || i < 0 || scroller.is(':animated')){
			return false;
		}
		
		weatherDiv.removeClass('first last');
		
		if(i == 0){
			weatherDiv.addClass('first');
		}
		else if (i == items.length-1){
			weatherDiv.addClass('last');
		}
		
		scroller.animate({left:(-i*100)+'%'}, function(){
			currentSlide = i;
		});
	}
	
	/*Manipulação de funções de erro */
	
	function locationError(error){
    	switch(error.code) {
			case error.TIMEOUT:
				showError("O tempo limite esgotou! Por favor, tente novamente!");
				break;
			case error.POSITION_UNAVAILABLE:
				showError('Não conseguimos achar sua localização, desculpe!');
				break;
			case error.PERMISSION_DENIED:
				showError('Por favor, permitir o acesso de geolocalização para que funcione.');
				break;
			case error.UNKNOWN_ERROR:
				showError('Um erro desconhecido ocorreu!');
				break;
		}
        
    }
    
	function showError(msg){
		weatherDiv.addClass('error').html(msg);
	}

});
