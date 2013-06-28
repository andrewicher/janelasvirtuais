/** @fileoverview oportunidades widget dor Janelas Virtuais/Tela Social
	@version 3.0
	
	@author Matheus Martins Teixeira <a href="mailto:mteixeira@grad.icmc.usp.br">&lt;mteixeira@grad.icmc.usp.br&gt;</a>
 */ 
/* ***** BEGIN LICENSE BLOCK *****
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
 *      Marcio Galli   <mgalli@taboca.com>
 *      Rafael Sartori <faelsartori@gmail.com>
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

 /**
	Objeto com as funções para o widget oportunidades
	@class
	@name oportunidades
 */
var oportunidades = {
	/** 
	Url para o rss do widget
	@type String
	*/
	feedURL : "http://query.yahooapis.com/v1/public/yql?q=select * from rss where url=\'"+ICMC_OPORTUNIDADES+"\'&format=json&callback=",
	/** 
	JSON retornado pela requisição dos itens
	@type JSON
	*/
	feed : null,
	/** 
	Fila com as noticias a serem exibidas
	@type Array
	*/
	queue : null,
	/** 
	URl do gerador de QRCodes
	@type String
	*/
	urlQR : "https://chart.googleapis.com/chart?cht=qr&chs=220x220&chld=M|0&chl=",
	/** 
	Objeto container do widget
	@type Dom Object
	*/
	container : null,
	/**
		Inicializa o widget highlights
		@public
		@function
	*/
	init : function() {
		this.queue = new Array();
		this.feed = new google.feeds.Feed(this.feedURL);
		this.feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
		this.feed.setNumEntries(10);
	},
	/**
		Inicia o widget
		@public
		@function
	*/
	start : function() {
		this.container = $('<div>').addClass('mainWrapper').appendTo('#container');

		setTimeout(function() {
			oportunidades.loadFeed();
		}, 100);
	},
	/**
		Atualiza a lista de itens do rss para o widget.
		O método {@link oportunidades.start} chama está função
		@private
		@function
	*/
	loadFeed : function() {
		$.getJSON(oportunidades.feedURL,function(e){
			oportunidades.createQueue(e.query.results);
			});
		/*this.feed.load(function(e) {
			oportunidades.createQueue(e)
		});*/
	},
	/**
		Cria a fila de noticias
		O método {@link oportunidades.loadFeed} chama está função
		@param {JSON Object} e Json com os dados carregados
		@private
		@function
	*/
	createQueue : function(e) {
	console.log(e);
		oportunidades.z = 1000;
		for(i=0;i<e.item.length &&i < 10;i++){
			var title = e.item[i].title;
			var link = e.item[i].link;
			var img = e.item[i].thumbnail.url;
			var desc = e.item[i].description;
			var category = e.item[i].category;
				oportunidades.queue.push({
					title : title,
					link : link,
					img : img,
					category:category,
					desc : desc.replace(/(<([^>]+)>)/ig," ").substr(0,200)+"..."
				});
		};
		oportunidades.counter = oportunidades.queue.length * 30;
		oportunidades.container.html('');
		setTimeout(function() {
			oportunidades.render()
		}, 100);
	},
	z : 1000,
	/**
		Renderiza os objetos no container do widget.
		Após processar os itens, o método {@link oportunidades.createQueue} chama está função
		@private
		@function
	*/
	render : function() {
		if(oportunidades.queue.length > 0) {
			
			var obj = oportunidades.queue.pop();
			var item = $('<div>').addClass('item').addClass('bg2');			
			var imagem = obj.img;
			var verify = imagem.indexOf("gif-");
			var image;
			if (verify == -1)
				image = $('<div>').addClass('img').addClass('gv250').addClass('gh200').addClass('fl').css("background-image","url("+imagem+")").css("background-size","cover");
			else
				image = $('<div>').addClass('img').addClass('gv250').addClass('gh200').addClass('fl');
			image.append($("<div>").html(obj.category).addClass('sub').addClass('gh200'));
			var event = $('<div>').addClass('fl').addClass('event').addClass('gh652');
			var title = $('<div>').addClass('title').html(obj.title);
			var desc = $('<div>').addClass('desc').html(obj.desc);
			item.append(image);
			item.append(event);
			event.append(title);
			event.append(desc);
			
			var link = obj.link;
			var slink = null;
			if(link!=null)
			$.ajax({
			  url: "http://query.yahooapis.com/v1/public/yql?q=insert into yahoo.y.ahoo.it (url, keysize) values ('"+link+"', 5)&format=json&callback=",
			  async: false,
			  dataType: 'json',
			  success: function (e) {
				console.log(e);
				link = e.query.results.url;
			  }
			});
			
			var fr =$('<div>').addClass('fr').addClass('qrcode').addClass('gv220').addClass('gh200');
			var qr = $('<img>').attr('src',oportunidades.urlQR + link).addClass('gv200').addClass('gh200');
			var shortenlink = $('<div>').addClass('link').html(link);
			fr.append(qr).append(shortenlink);
			item.append(fr);
			item.appendTo(oportunidades.container);;
			setTimeout(function() {
				oportunidades.render();
			}, 100);
		} else {
			//oportunidades.swap();
		}
	},
	shortLink:function(link,save){
		save=link;
	},
	counter : 0,
	/**
		Função auxiliar na renderização. Faz o efeito de transição entre as notícias.
		@private
		@function
	*/
	swap : function() {
		if(oportunidades.counter > 0) {
			$($(oportunidades.container).find('.item')[0]).fadeOut(1000, function() {
				$(this).remove().appendTo(oportunidades.container).show().css('z-index', oportunidades.z--);
				oportunidades.counter--;
				setTimeout(function() {
					oportunidades.swap();
				}, 7000);
			});
		} else {
			oportunidades.loadFeed();
		}
	}
}
