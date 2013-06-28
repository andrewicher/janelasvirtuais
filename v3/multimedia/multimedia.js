/** @fileoverview <pre> Multimedia widget para TelaSocial/Janelas Virtuais
	Desenhado em tempo real usando SVG.
	Baseado no antigo widget do Flickr by Taboca.
	</pre>
	@version 1.0
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
	Objeto com as ações do widget
	@class
	@name multimedia
 */
var multimedia = {
	/** 
	Url para o json com as fotos do perfil no Facebook.
	@type String
	*/
	URL : ICMC_FB_ALBUMS,
	/** 
	Array com os objetos albums.
	@type array
	*/
	albums : null,
	/** 
	Div que irá armazenar o widget
	@type DOM Object
	*/
	container : null
	,
	/** 
	Div que contém a fila de fotos
	@type DOM Object
	*/
	queueDiv : null,
	/** 
	Div que exibe as fotos como um slideshow
	@type DOM object
	*/
	slideShowDiv : null,
	/** 
	Tempo de troca em milisegundos
	@default 5000
	@type int
	*/
	swapTime : 5000,
	/**
		Inicializa o widget
		@param {DOM Object} obj Container do widget
		@public
		@function
	*/
	init : function(obj) {
		multimedia.container = $("<div>").addClass('mainWrapper').appendTo($(obj))
		multimedia.albums = new Array();
		$('<input>').attr('type', 'hidden').attr('id', 'hascontent').attr('id', 'hascontent').appendTo("#container");
	},
	/**
		Inicia o widget
		@public
		@function
	*/
	start : function() {
		multimedia.__loadAlbums();
	},
	/**
		Carrega os albums do link {@link multimedia.URL}
		@private
		@function
	*/
	__loadAlbums : function() {
		$.getJSON(multimedia.URL, function(e) {
			multimedia.__storeAlbums(e.data);
		})
	},
	/**
		Armazena os albums no array de albums.
		@param {JSON Object} e Json com os albums carregados
		@private
		@function
	*/
	__storeAlbums : function(e) {
		var i = 0;
		//console.log(e.length)
		for( i = 0; i < 5; i++) {
			var album = new multimedia.prepareAlbum(e[i]);
			album.loadPhotos();
			this.albums.push(album);
		}
		if(e.length > 0)
			$('#hascontent').attr('value', '1');
		else
			$('#hascontent').attr('value', '0');
		setTimeout(function() {
			multimedia.render();
		}, 900);
	},
	cc : 0,
	/**
		Renderiza os albums dentro da div container.
		@private
		@function
	*/
	render : function() {
		var album = Math.floor(Math.random() * multimedia.albums.length);
		var present = multimedia.albums[album];

		if(present.photos.length != 0 && multimedia.cc > 0) {
			var photo = present.photos.pop();
			multimedia.container.css('background-image','url("'+photo.image+'")').css('background-position','center center').css('background-repeat','no-repeat').css('background-size','contain');
			console.log(present.name);
			//var subtitle = $('<div>').addClass('subtitle').addClass('gh1080').html(present.name);
			multimedia.container.append($("<div>").html(present.name).addClass('subtitle').addClass('gh1080'));
			//$('.mainWrapper .text').html("texto aqui");
			multimedia.cc--;
		}
		if(multimedia.cc > 0)
			setTimeout(function() {
				multimedia.render();
			}, 30000);
		if(multimedia.cc == 0)
			multimedia.start();

	},
	/**
		Inicia o efeito de slideshow
		@private
		@function
	*/
	/**
		Produz o efeito de troca entre as imagens.
		@private
		@function
	*/
	/**
		Formata um objeto JSON para um objeto album do widget.
		@param {JSON Object} obj Album do tipo objeto JSON com o padrão do Facebook
		@private
		@function
	*/
	prepareAlbum:function(obj){
		this.name = obj.name;
		this.fbId = obj.id;
		this.description = obj.description;
		this.photos = new Array();
		var self = this;
		this.storePhotos = function(e) {
			for(var i = 0; i < e.length; i++) {
				var ph = new multimedia.preparePhoto(e[i]);
				self.photos.push(ph);
				multimedia.cc++;
			}
		};
		this.loadPhotos = function() {
			$.getJSON("https://graph.facebook.com/" + this.fbId + "/photos?access_token=" + API_KEY_FACEBOOK + "&format=json", function(e) {
				self.storePhotos(e.data);
			}).error(function(e){console.log(e+" ERROR!")});
		}
		var self = this;
		if(obj.updatedTime != null) {
			var date = (obj.updated_time.split('T')[0]).split('-');
			var time = ((obj.updated_time.split('T')[1]).split('+')[0]).split(':');
		} else {
			var date = (obj.created_time.split('T')[0]).split('-');
			var time = ((obj.created_time.split('T')[1]).split('+')[0]).split(':');
		}
		this.updated_time = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2], 0);
		this.updated_time = new Date((this.updated_time.getTime() - (this.updated_time.getTimezoneOffset() * 60 * 1000)));
		this.likes = 0;
		if(obj.likes != null)
			this.likes = obj.likes.data.length;
	},
	/**
		Formata um objeto JSON para um objeto foto do widget.
		@param {JSON Object} obj Photo do tipo objeto JSON com o padrão do Facebook
		@private
		@function
	*/
	preparePhoto:function(obj){
		this.image = obj.images[0].source;
		this.w = obj.images[0].width;
		this.h = obj.images[0].height;
		this.id = obj.id;

		if(obj.message != null)
			this.message = obj.message;
		else
			this.message = null;

		var self = this;
		if(obj.updatedTime != null) {
			var date = (obj.updated_time.split('T')[0]).split('-');
			var time = ((obj.updated_time.split('T')[1]).split('+')[0]).split(':');
		} else {
			var date = (obj.created_time.split('T')[0]).split('-');
			var time = ((obj.created_time.split('T')[1]).split('+')[0]).split(':');
		}
		this.updated_time = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2], 0);
		this.updated_time = new Date((this.updated_time.getTime() - (this.updated_time.getTimezoneOffset() * 60 * 1000)));
		this.likes = 0;
		if(obj.likes != null)
			this.likes = obj.likes.data.length;
	}
}

/* call all elements */
$(document).ready(function() {
	multimedia.init('#container');
	multimedia.start();
});
