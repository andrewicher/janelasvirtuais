/** @fileoverview Agenda widget for Janelas Virtuais/TelaSocial
	
	@version 1.0
	@author Matheus Martins Teixeira <a href="mailto:mteixeira@grad.icmc.usp.br">&lt;mteixeira@grad.icmc.usp.br&gt;</a>
 */ 

 /*
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is TelaSocial
 *
 * The Initial Developer of the Original Code is Taboca TelaSocial.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      @author Marcio Galli   <mgalli@taboca.com>
 *      @author Rafael Sartori <faelsartori@gmail.com>
 *      @author Matheus Teixeira <teixeira.mdk@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

 /**
	Objeto com as funções para o widget agenda
	@class
	@name agenda
 */
var agenda = {
	/** 
	Array com as url's para os eventos
	@type array
	*/
	urlFeed : ICMC_EVENTOS,
	/**
	Lista dos eventos do feed rss 
	@type array
	*/
	feedList : null,
	/**
	Lista dos eventos no widget
	@type array
	*/
	feedEvents : null,
	/** 
	Objeto que irá conter os eventos
	@type DOM Object
	*/
	container : null,
	/** 
	Número máximo de itens renderizados (tamanho da tela/tamanho de um item)
	@type int
	*/
	maxItens : window.innerHeight / 150,
	/** 
	Tempo para atualização dos feeds. 
	@type int
	*/
	timeRefresh : 90, // in seconds
	/** 
		Inicializa o widget agenda
		@param {DOM Object} obj Container dos eventos
		@public
		@function
	*/
	init : function(obj) {
		agenda.container = $(obj);
		setTimeout(function() {
			agenda.start();
		}, 100);
		var refresh = setInterval(function() {
			agenda.start();
		}, agenda.timeRefresh * 1000);
	},
	/**
		Inicia o widget
		O método {@link agenda.init} chama está função
		@private
		@function
	*/
	start : function() {
		agenda.container.html('');
		$('<input>').attr('type', 'hidden').attr('id', 'hascontent').attr('id', 'hascontent').appendTo($('body'));
		agenda.feedList = new Array();
		agenda.feedEvents = null;
		agenda.status = 0;
		setTimeout(function() {
			agenda.updateFeed()
		}, 100);
	},
	/**
		Atualiza a lista de itens do rss para o widget.
		O método {@link agenda.start} chama está função
		@private
		@function
	*/
	updateFeed : function() {
		$('#hascontent').attr('value', '0');
		$.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from rss where url=\"" + agenda.urlFeed + "\"&format=json",function(e){
			agenda.feedEvents = e.query.results.item;
			agenda.process();
		});		
	},
	/**
		Processa os itens atualizados na lista de eventos e cria um arrayList pré formatado para os eventos.
		O método {@link agenda.updateFeed} chama está função.
		@private
		@function
	*/
	process : function() {
		for(var i = 0; agenda.feedEvents != null && i < agenda.feedEvents.length; i++) {
			agenda.feedEvents[i].pubDate = new Date(agenda.feedEvents[i].pubDate);
			agenda.feedList.push(agenda.feedEvents[i]);
		}
		agenda.render();
	},
	/**
		Renderiza os objetos no container do widget. Limite dado por {@link agenda.maxItens}
		Após processar os itens, o método {@link agenda.process} chama está função
		@private
		@function
	*/
	render : function() {
		agenda.container.html('');
		$('#hascontent').attr('value', '1');
		agenda.feedList.sort(agenda.compareDate);
		for(var i = 0; i < agenda.feedList.length && i < agenda.maxItens; i++) {
			agenda.container.append(agenda.printItem(agenda.feedList[i]));
		}
	},
	/**
		Função auxiliar para ordenação dos eventos por data.
		@param {DOM Object} a Item para comparação
		@param {DOM Object} b Item para comparação
		@returns {int} 0 se igual, 1 se a é mais recente e -1 se a é mais antigo.
		@private
		@function
	*/
	compareDate : function(a, b) {
		if(a.pubDate < b.pubDate)
			return -1;
		else if(a.pubDate > b.pubDate)
			return 1;
		else
			return 0;
	},
	/**
		Função auxiliar que retorna uma string com a formatação de data e hora para pt-br.
		@param {Object} data Objeto a ser formatado
		@returns {String} Data formatada para pt-br. Ex. Domingo, 2 de Janeiro ás 12:00h
		@private
		@function
	*/
	formatDate : function(data) {
		var months = Array('Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');
		var weekDay = Array('Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado');
		var time = (data.getHours() < 10 ? '0' + data.getHours() : data.getHours()) + ":" + (data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes());

		return (weekDay[data.getDay()] + ", " + data.getDate() + ' de ' + months[data.getMonth()] + ' às ' + time + 'h');
	},
	/**
		Formata os objetos para códigos HTML para renderização.
		O método {@link agenda.render} chama esse método no momento da renderização.
		@param {Object} obj Objeto para codificação
		@returns {DOM Object} Objeto DOM para ser renderizado.
		@private
		@function
	*/
	printItem : function(obj) {
		var count = 0;
		while (count < 11){
			console.log(obj);
			var item = $('<div>').addClass('item');
			item.addClass("bg2");
			var typetitle = $('<div>').addClass('line').addClass('sep').addClass('title').html('<sub>Conteúdo: '+obj.category+'</sub>' + '<br>' + obj.title);
			var datetime = $('<div>').addClass('line').addClass('column0').html('<sub>Data: </sub><span>' + agenda.formatDate(obj.pubDate) + '</span>');
			var local = $('<div>').addClass('line').addClass('column0').html('<sub>Local: </sub><span>' + (obj.local!=null?obj.local:"") + '</span>');
			item.append(typetitle).append(datetime).append(local);

			return item;
		}
	},animate:function(){
		
	}
}
