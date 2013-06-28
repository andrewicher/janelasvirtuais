/** @fileoverview Widget convidativo ao projeto. Efetua transições exibindo informaçãoes de como interagir.

	@version 1.0
	@author Matheus Martins Teixeira <a href="mailto:mteixeira@grad.icmc.usp.br">&lt;mteixeira@grad.icmc.usp.br&gt;</a>
 */
  /**
	Objeto com as funções para o widget convidatido do projeto.
	@class
	@name joinUs
 */
 var joinUs = {
	/** 
	Div que irá armazenar o widget.	
	@type DOM Object
	*/
	container : null,
	/** 
	Tempo em milisegundos para a transição entre os frames.
	@default 8000
	@type int
	*/
	swapTime: 8000,
	/**
	Contador de transições
	@type {int^}
	@private
	*/
	counter : 0,
	/**
		Inicia o widget
		@public
		@function
	*/
	numSlides:0,
	start : function() {
		joinUs.container = $('<div>').addClass('main').appendTo('#container');
		var slide1 = joinUs.modelSlide();
		slide1.append($("<iframe>").addClass('bandejao').attr("src", "../bandejao/index.html"));
		var slide2 = joinUs.modelSlide();
		slide2.append($("<iframe>").addClass('bandejao').attr("src", "../weather/index.html"));
		joinUs.container.append($('<div>').addClass('wrapper').append(slide1).append(slide2));
		setTimeout(function() {
			$('.wrapper').find('.page').each(function(){joinUs.numSlides++});
			joinUs.next();
		}, joinUs.swapTime);
	},
	/**
		Contrutor para um modelo de frame
		@private
		@returns {DOM Object} Retorna o objeto do modelo.
		@function
	*/
	modelSlide : function() {
		return $('<div>').addClass('page');
	},
	/**
		Efetua a transição suave entre frames.
		@private
		@function
	*/
	next : function() {
		var first = $(joinUs.container.children()[0]);
		if(joinUs.counter < joinUs.numSlides-1) {
			first.animate({
				"margin-top" : (parseInt(first.css('margin-top')) - 300) + 'px'
			}, joinUs.swapTime/8, function() {
				joinUs.counter++;
				setTimeout(function() {
					joinUs.next();
				}, joinUs.swapTime);
			});
		} else {
			first.animate({
				"margin-top" : '0px'
			}, joinUs.swapTime/8, function() {
				joinUs.counter = 0;
				setTimeout(function() {
					joinUs.next();
				}, joinUs.swapTime);
			});
		}
	}
};

$(document).ready(function() {
	joinUs.start();
});
