/** @fileoverview <pre>Widget social para o Tela Social/Janelas Virtuais
	Baseado no widget Twitter Social by Taboca
</pre>
	@version 1.1
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
	Objeto com as funções para o widget social
	@class
	@name social
 */
var social = {
	/** 
	URL para requisição dos posts do grupo social do ICMC
	@type String
	*/
	URL : ICMC_FACEBOOK,
	/** 
	Array com os comentários do grupo
	@type array
	*/
	comments : null,
	/** 
	Div container do widget.
	@type DOM Object
	*/
	container : null,
	/** 
	Lista com os posts do Grupo em formato DOM
	@type DOM Object
	*/
	listObj : null,
	/** 
	Numero máximo de posts.
	@type int
	@default 5
	*/
	numberPosts : 10,
	/** 
	Tempo atualização em segundos.
	@type int
	@default 45
	*/
	time: 90,
	/**
		Inicializa o widget
		@param {DOM Object} obj Container dos posts
		@public
		@function
	*/
	init : function(obj) {
		social.URL = social.URL+'&limit='+social.numberPosts;
		social.comments = new Array();
		social.container = $(obj);
		social.listObj = $('<ul>').appendTo(social.container);
	},
	swapTime:10*1000,
	/**
		Inicia o widget
		@public
		@function
	*/
	start : function() {
		//$('<img>').attr('src', 'f_logo.png').addClass('facebookLogo').appendTo(social.container);
		$('<input>').attr('type', 'hidden').attr('id', 'hascontent').attr('id', 'hascontent').appendTo(social.container);
		setTimeout(function(){social.animate()},social.swapTime);
		social.loadComments();
	},
	/**
		Carrega os posts do grupo
		@private
		@function
	*/
	loadComments : function() {
		$.getJSON(social.URL, function(e) {
			social.__storeComments(e);
		});
	},
	/**
		Armazena os posts na memoria do widget
		@param {DOM Object} e Objeto JSON com os posts
		@private
		@function
	*/
	__storeComments : function(e) {
		social.createQueue(e.data);
	},
	/**
		Cria o array de posts em {@link social.comments}
		@param {DOM Object} e Objeto JSON com os posts
		@private
		@function
	*/
	createQueue : function(e) {
		var i = 0;
		for( i = 0; i < e.length && i < social.numberPosts; i++) {
			var reply = new social.prepareComment(e[i]);
			social.comments.push(reply);
		}

		social.listObj.html('');
		setTimeout(function() {
			social.render();
		}, 100);
	},
	/**
		Renderiza os posts na div {@link social.container}
		@private
		@function
	*/
	render : function() {
	
		if(social.comments.length > 0) {
			$('#hascontent').attr('value', '1');
			var post = social.comments.pop();
		
			social.postFormat(post);
			setTimeout(function() {
				social.render();
			}, 100);
		} else {
			setTimeout(function() {
				$('#hascontent').attr('value', '0');
				social.loadComments();
			}, social.time*1000);
		}
	},
	/**
		Formata o post com os códigos HTML para exibição
		@param {DOM Object} e Post a ser formatado
		@private
		@function
	*/
	postFormat : function(e) {
		if(e.story==null){
			var storyContent = $('<div>').addClass('storyContent').appendTo($("<li>").prependTo(social.listObj));
			var clearfix = $('<div>').addClass('clearfix').appendTo(storyContent);
			$('<div>').append($('<img>').attr('src', 'http://graph.facebook.com/' + e.user_id + '/picture?type=large')).addClass('actorPhoto').appendTo(clearfix);
			var mainWrapper = $('<div>').addClass('mainWrapper').appendTo($('<div>').addClass('storyInnerContent').appendTo(clearfix));
			$('<div>').addClass('actorName').html(e.from).appendTo(mainWrapper);
			if(e.message!=null){
				var el = $('<div>').addClass('ellipsis').appendTo(mainWrapper);
				var w = $('<div>').addClass('messageBody').html(e.message).appendTo(el);
				if(w.height() > el.height())
					mainWrapper.append('...');
			}
			
			if(e.type=="status"){
				$('<abbr>').addClass('messageFooter').append(social.calcDate(e.updated_time)).appendTo(mainWrapper);
				var listReplies = $('<ul>').addClass('listReplies').appendTo($('<div>').appendTo(mainWrapper));

				if(e.likes == 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' like')).appendTo($('<li>').appendTo($(".clearfix .actorphoto")));
				else if(e.likes > 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' likes')).appendTo($('<li>').appendTo($(".clearfix .actorphoto")));
				var i = 0;
				for(; i < e.comments.length; i++) {
					var comment = $('<div>').addClass('clearfix').appendTo($('<li>').appendTo(listReplies));
					$('<img>').addClass('actorPhoto').attr('src', 'http://graph.facebook.com/' + e.comments[i].user_id + '/picture?type=square').appendTo(comment);
					var commentContent = $('<div>').addClass('commentContent').appendTo(comment);
					$('<span>').addClass('actorName').html(e.comments[i].from).appendTo(commentContent);
					$('<span>').addClass('commentBody').html(e.comments[i].message).appendTo(commentContent);
					var commentFooter = $('<div>').addClass('commentFooter').appendTo(commentContent);
					$('<abbr>').append(social.calcDate(e.comments[i].updated_time)).appendTo(commentFooter);

					if(e.comments[i].likes > 0) {
						commentFooter.append(' · ');
						$('<span>').append($('<img>').attr('src', 'like-50.png').addClass('likeIcon')).addClass('replyLikes').append(e.comments[i].likes).appendTo(commentFooter);
					}
				}
			}else if(e.type=="photo"){
				$('<div>').addClass('image').append($('<img>').attr('src',e.picture)).appendTo(mainWrapper);
				$('<abbr>').addClass('messageFooter').append(social.calcDate(e.updated_time)).appendTo(mainWrapper);
				var listReplies = $('<ul>').addClass('listReplies').appendTo($('<div>').appendTo(mainWrapper));

				if(e.likes == 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' like')).appendTo($('<li>').appendTo($(".clearfix .actorphoto")));
				else if(e.likes > 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' likes')).appendTo($('<li>').appendTo($(".clearfix .actorphoto")));
				var i = 0;
				for(; i < e.comments.length; i++) {
					var comment = $('<div>').addClass('clearfix').appendTo($('<li>').appendTo(listReplies));
					$('<img>').addClass('actorPhoto').attr('src', 'http://graph.facebook.com/' + e.comments[i].user_id + '/picture?type=square').appendTo(comment);
					var commentContent = $('<div>').addClass('commentContent').appendTo(comment);
					$('<span>').addClass('actorName').html(e.comments[i].from).appendTo(commentContent);
					$('<span>').addClass('commentBody').html(e.comments[i].message).appendTo(commentContent);
					var commentFooter = $('<div>').addClass('commentFooter').appendTo(commentContent);
					$('<abbr>').append(social.calcDate(e.comments[i].updated_time)).appendTo(commentFooter);

					if(e.comments[i].likes > 0) {
						commentFooter.append(' · ');
						$('<span>').append($('<img>').attr('src', 'like-50.png').addClass('likeIcon')).addClass('replyLikes').append(e.comments[i].likes).appendTo(commentFooter);
					}
				}
			}else if(e.type=="video" || e.type=="link"){
				var share = $('<div>').addClass('share').appendTo(mainWrapper).addClass('clearfix');
				if(e.type=='link' && e.picture!=null)
					$('<div>').addClass('left').append($('<img>').attr('src',e.picture+'&cfs=1')).appendTo(share);
				else
					$('<div>').addClass('left').append($('<img>').attr('src',e.picture)).appendTo(share);
				$('<div>').addClass('right').append($('<div>').append(e.name).addClass('actorName')).append($('<span>').html(e.caption).addClass('caption')).append($('<div>').addClass('description').html(e.description)).appendTo(share);
				
				$('<abbr>').addClass('messageFooter').append(social.calcDate(e.updated_time)).appendTo(mainWrapper);
				var listReplies = $('<ul>').addClass('listReplies').appendTo($('<div>').appendTo(mainWrapper));

				if(e.likes == 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' like')).appendTo($('<li>').appendTo($(".clearfix .actorphoto")));
				else if(e.likes > 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' likes')).appendTo($('<li>').appendTo($(".clearfix .actorphoto")));
				var i = 0;
				for(; i < e.comments.length; i++) {
					var comment = $('<div>').addClass('clearfix').appendTo($('<li>').appendTo(listReplies));
					$('<img>').addClass('actorPhoto').attr('src', 'http://graph.facebook.com/' + e.comments[i].user_id + '/picture?type=square').appendTo(comment);
					var commentContent = $('<div>').addClass('commentContent').appendTo(comment);
					$('<span>').addClass('actorName').html(e.comments[i].from).appendTo(commentContent);
					$('<span>').addClass('commentBody').html(e.comments[i].message).appendTo(commentContent);
					var commentFooter = $('<div>').addClass('commentFooter').appendTo(commentContent);
					$('<abbr>').append(social.calcDate(e.comments[i].updated_time)).appendTo(commentFooter);

					if(e.comments[i].likes > 0) {
						commentFooter.append(' · ');
						$('<span>').append($('<img>').attr('src', 'like-50.png').addClass('likeIcon')).addClass('replyLikes').append(e.comments[i].likes).appendTo(commentFooter);
					}
				}
			}
		}else{
			if(e.type=="photo"){
				var storyContent = $('<div>').addClass('storyContent').appendTo($("<li>").prependTo(social.listObj));
				var clearfix = $('<div>').addClass('clearfix').appendTo(storyContent);
				$('<div>').append($('<img>').attr('src', 'http://graph.facebook.com/' + e.user_id + '/picture?type=normal')).addClass('actorPhoto').appendTo(clearfix);
				var mainWrapper = $('<div>').addClass('mainWrapper').appendTo($('<div>').addClass('storyInnerContent').appendTo(clearfix));
				$('<div>').addClass('actorName').html(e.story).appendTo(mainWrapper);
				$('<div>').addClass('image').append($('<img>').attr('src',e.picture)).appendTo(mainWrapper);
				$('<abbr>').addClass('messageFooter').append(social.calcDate(e.updated_time)).appendTo(mainWrapper);
				var listReplies = $('<ul>').addClass('listReplies').appendTo($('<div>').appendTo(mainWrapper));

				if(e.likes == 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' like')).appendTo($('<li>').appendTo(listReplies));
				else if(e.likes > 1)
					$('<div>').addClass('clearfix').append($('<img>').attr('src', 'like-50.png').addClass('commentLike')).append($('<span>').html(e.likes + ' likes')).appendTo($('<li>').appendTo(listReplies));
				var i = 0;
				for(; i < e.comments.length; i++) {
					var comment = $('<div>').addClass('clearfix').appendTo($('<li>').appendTo(listReplies));
					$('<img>').addClass('actorPhoto').attr('src', 'http://graph.facebook.com/' + e.comments[i].user_id + '/picture?type=square').appendTo(comment);
					var commentContent = $('<div>').addClass('commentContent').appendTo(comment);
					$('<span>').addClass('actorName').html(e.comments[i].from).appendTo(commentContent);
					$('<span>').addClass('commentBody').html(e.comments[i].message).appendTo(commentContent);
					var commentFooter = $('<div>').addClass('commentFooter').appendTo(commentContent);
					$('<abbr>').append(social.calcDate(e.comments[i].updated_time)).appendTo(commentFooter);

					if(e.comments[i].likes > 0) {
						commentFooter.append(' · ');
						$('<span>').append($('<img>').attr('src', 'like-50.png').addClass('likeIcon')).addClass('replyLikes').append(e.comments[i].likes).appendTo(commentFooter);
					}
				}
				
			}
		}
	},
	/**
		Calcula o tempo que se passou após o post.
		@param {Date} date Objeto data
		@private
		@function
	*/
	calcDate : function(date) {
		var now = new Date();
		var seconds = Math.floor((now.getTime() - date.getTime()) / 1000) % 60;
		var minutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60) % 60;
		var hours = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60) % 60;
		var days = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60 / 24) % 24;
		var months = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60 / 24 / 30) % 30;
		if(months > 0) {
			return months + ' meses atrás';
		} else if(days > 0) {
			if(days == 1) {
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
				return 'Ontem ás ' + h + ':' + m + ' horas';
			} else
				return days + ' dias atrás';
		} else if(hours > 0) {
			return hours + ' horas atrás';
		} else if(minutes > 0) {
			return 'há ' + minutes + ' minutos';
		} else {
			return 'há ' + seconds + ' segundos';
		}
	},	
	/**
		Prepara o comentário para ser trabalhado pelo widget.
		@param {JSON Object} postData Objeto JSON com o post do Facebook
		@private
		@function
	*/
	prepareComment:function(postData) {
		this.id = postData.id;
		this.user_id = postData.from.id;
		this.from = postData.from.name;
		this.message = (postData.message != null) ? postData.message.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "<br />") : null;
		this.name = (postData.name != null) ? postData.name : null;
		this.message_tags = (postData.message_tags != null) ? postData.message_tags : null;
		this.picture = postData.picture;
		this.object_id=postData.object_id;
		this.story = postData.story;
		
		if(this.picture != null) {
			this.picture = this.picture.replace("_s.jpg","_n.jpg");
		}
		
		this.link = (postData.link != null) ? postData.link : null;
		this.name = postData.name;
		this.caption = (postData.caption != null) ? postData.caption : null;
		this.source = (postData.source != null) ? postData.source : null;
		this.icon = (postData.icon != null) ? postData.icon : null;
		this.proprieties = (postData.proprieties != null) ? postData.proprieties : null;
		this.description = (postData.description != null) ? postData.description : "";
		this.type = postData.type;
		this.likes = (postData.likes != null) ? ((postData.likes.count != null) ? postData.likes.count : postData.likes) : 0;
		this.place = (postData.place != null) ? postData.place : null;
		
		if(postData.updatedTime != null) {
			var date = (postData.updated_time.split('T')[0]).split('-');
			var time = ((postData.updated_time.split('T')[1]).split('+')[0]).split(':');
		} else {
			var date = (postData.created_time.split('T')[0]).split('-');
			var time = ((postData.created_time.split('T')[1]).split('+')[0]).split(':');
		}
		this.updated_time = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2], 0);
		this.updated_time = new Date((this.updated_time.getTime() - (this.updated_time.getTimezoneOffset() * 60 * 1000)));

		/* create coment queue for this post */
		this.comments = new Array();
		if(postData.comments != null && postData.comments.count > 0) {
			for( i = 0; i < postData.comments.count; i++) {
				var reply = new social.prepareComment(postData.comments.data[i]);
				this.comments.push(reply);
			}
		}
	},animate:function(){	
		var first = social.listObj.find('li').first();
		first.animate({'margin-top':-first.height()},500,function(){
			first.css('margin-top',0).remove().appendTo(social.listObj);
		});
		setTimeout(function(){social.animate()},social.swapTime);
	}
}