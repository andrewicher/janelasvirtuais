/** @fileoverview Bandejão widget for Janelas Virtuais/TelaSocial

	@version 1.1
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
 *      Matheus Teixeira <teixeira.mdk@gmail.com>
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
 
function decode(e) {
	return e.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "");
};


 /**
	Objeto com as funções para o widget bandejão
	@class
	@name bandejao
 */
var bandejao = {
	/**
		
		@type 
	*/
	json : null,
	/**
		Url para o rss do cardápio o restaurante universitário
		@type String
	*/
	url : USP_CARDAPIO,
	/**
		Variável que retorna se houveram erros
		@type Boolean
	*/
	error : false,
	/**
		Objeto container para renderização
		@type Dom Object
	*/
	container : null,
	/**
		Inicia o widget
		@public
		@function
	*/
	start : function() {
		bandejao.container = $('#container');
		bandejao.loadMenu();
	},
	/**
		Atualiza o cardápio do restaurante universitário
		@private
		@function
	*/
	loadMenu : function() {
		$.getJSON(bandejao.url).success(function(e) {
			bandejao.processMenu(e.query.results.restaurante);
		}).error(bandejao.error = true);
	},
	/**
		Processa os itens atualizados do cardáio
		@private
		@param {JSON} e Objeto JSON com os itens do cardápio
		@function
	*/
	processMenu : function(e) {
		if(e[bandejao.weekDate()] != null) {
			var menu = new Array(2);
			if(e[bandejao.weekDate()].almoco.principal != null) {
				var lunch = e[bandejao.weekDate()].almoco;
				menu[0] = $('<div>').append('<h2>Almoço</h2><h2>' + decode(lunch.principal) + '</h2><h2>' + decode(lunch.acompanhamento) + '</h2><h2>' + decode(lunch.salada) + '</h2><h2>' + decode(lunch.sobremesa) + '</h2>');
			} else {
				menu[0] = $('<div>').append('<h2>Almoço</h2><h2>Não terá almoço hoje! :(</h2>');
			}
			if(e[bandejao.weekDate()].jantar.principal != null) {
				var dinner = e[bandejao.weekDate()].jantar;
				menu[1] = $('<div>').append('<h2>Janta</h2><h2>' + decode(dinner.principal) + '</h2><h2>' + decode(dinner.acompanhamento) + '</h2><h2>' + decode(dinner.salada) + '</h2><h2>' + decode(dinner.sobremesa) + '</h2>');
			} else {
				menu[1] = $('<div>').append('<h2>Janta</h2><h2>Não terá janta hoje! :(</h2>');
			}
			bandejao.container.append('<h1>Bandejão de ' + bandejao.weekDate() + '</h1>').append($('<div>').addClass('col').append(menu[0])).append($('<div>').addClass('col').append(menu[1]));
		} else {
			bandejao.container.append('<h1>Bandejão de ' + bandejao.weekDate() + '</h1>').append('<h2>Não teremos refeição hoje! :/</h2>');
		}
		setTimeout(function() {
			bandejao.lbboadMenu()
		}, 3 * 60 * 60 * 1000);
	},
	/**
		Retorna o dia da semana referente a data atual
		@private
		@returns Retorna o dia da semana referente a data atual
		@function
	*/
	weekDate : function() {
		var weekDays = new Array('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado');
		var today = new Date();
		//today.setDate(3);
		return weekDays[today.getDay()];
	}
};

$(document).ready(function() {
	bandejao.start();
})