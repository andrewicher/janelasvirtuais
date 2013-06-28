/** @fileoverview SVG Clock widget.
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
	Armazena os segundos do horario atual
	@type Number
*/
var seconds = null;
/**
	Armazena os minutos do horario atual
	@type Number
*/
var minutes = null;
/**
	Armazena as horas do horario atual
	@type Number
*/
var hour    = null;
/**
	Armazena o dia da data atual
	@type Number
*/
var day     = null;
/**
	Armazena a data atual
	@type Date
*/
var date    = null;


/**
	Inicia o relógio
	@public
	@function
*/
function start() { 
    seconds =document.getElementById("seconds");
    minutes =document.getElementById("minutes");
    hour = document.getElementById("hour");
    day = document.getElementById("day");
    date = document.getElementById("date");
    tick();
};
/**
	Função que gera o tick do relógio (1 tick per second)
	@Private
	@function
*/
function tick() {
	data = new Date();
	var days = new Array();
	days[0] = "domingo";
	days[1] = "segunda-feira";
	days[2] = "ter\u00e7a-feira";
	days[3] = "quarta-feira";
	days[4] = "quinta-feira";
	days[5] = "sexta-feira";
	days[6] = "s\u00e1bado";
	
	var months = new Array();
	months[0] = "janeiro";
	months[1] = "fevereiro";
	months[2] = "mar\u00e7o";
	months[3] = "abril";
	months[4] = "maio";
	months[5] = "junho";
	months[6] = "julho";
	months[7] = "agosto";
	months[8] = "setembro";
	months[9] = "outubro";
	months[10] = "novembro";
	months[11] = "dezembro";
	
	var hours = data.getHours();
	var min = data.getMinutes();
	var secs = data.getSeconds();
	var wday = data.getDay();
	var month = data.getMonth();
	var dt = data.getDate();
	
	var psecs = "";
	var pmin = "";
	var phour = "";
	if(secs<=9) {
		psecs = "0";
	} 
	if(min<=9) { 
		pmin = "0";
	}
	if(hours<=9) { 
		phour = "0";
	} 
    
    hour.textContent = phour+hours;
    minutes.textContent = pmin+min;
    seconds.textContent = psecs+secs;
    date.textContent = dt + " de "+months[month];
    day.textContent = days[wday];
	setTimeout( function () { tick() }, 1000);
};

start();
