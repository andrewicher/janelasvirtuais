/** @fileoverview Variaveis globais do projeto.
 */ 
/** 
	Chave da API do Google
	@type String
	*/
API_KEY_GOOGLE = 'ABQIAAAAqKq_hUOi903XRQ2gYbnGZxTcA8ivpSz_zP84CoIFwAWCEPSr7hSWOeiLObKzE8uifiqpPR4nD9rKXQ';
/** 
	Chave da API do Facebook
	@type String
	*/
API_KEY_FACEBOOK = 'AAAESMJIoSrEBALwwIzJacN1GQobMVHZCczS5EYHZApbAOWCFwD9uD0NefCKv1tCtqUTUdGd11HZA1iClDjzIfO73j1LISCD3XnXslRWzQZDZD';

/** 
	URL para o RSS do tempo
	@type String
	*/
URL_WEATHER = "http://www.google.com/ig/api?weather=Sao-Carlos&hl=pt-br";
/** 
	URL de requisição do cardápio em JSON (Bandejão)
	@type String
	*/
USP_CARDAPIO = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.pcasc.usp.br%2Frestaurante.xml'&format=json";

//ICMC_DESTAQUES      = "http://www.icmc.usp.br/feed/noticias.php";
/** 
	URL para os destaques do ICMC em RSS. (Sala de Imprensa)
	@type String
	*/
ICMC_DESTAQUES = "http://janelasvirtuais.icmc.usp.br/rss/noticias.php";
ICMC_OPORTUNIDADES = "http://janelasvirtuais.icmc.usp.br/rss/oportunidades.php";
//ICMC_DESTAQUES = "http://icmc-usp.blogspot.com/feeds/posts/default?alt=rss";
/** 
	URL para requisição do RSS do Flickr
	@deprecated
	@type String
	*/
ICMC_FLICKR = "http://api.flickr.com/services/feeds/photos_public.gne?id=56306050@N03&lang=pt-br&format=&" + new Date().getTime();
/** 
	Array de URL's para requisições dos eventos do ICMC
	@type Array
	*/
//ICMC_EVENTOS = new Array();
ICMC_EVENTOS = "http://janelasvirtuais.icmc.usp.br/rss/eventos.php";

/*ICMC_EVENTOS[0] = "http://www.icmc.usp.br/feed/palestras.xml?" + new Date().getTime();
ICMC_EVENTOS[1] = "http://www.icmc.usp.br/feed/bancas.xml?" + new Date().getTime();*/
/** 
	URL para requisição dos posts no Grupo do ICMC
	@type String
	*/
ICMC_FACEBOOK = "https://graph.facebook.com/359610410723189/feed?access_token="+API_KEY_FACEBOOK+"&format=json";
SEMCOMP_FACEBOOK = "https://graph.facebook.com/299026583498410/feed?access_token="+API_KEY_FACEBOOK+"&format=json";
/** 
	URL para requisição dos albums de fotos do ICMC
	@type String
	*/
ICMC_FB_ALBUMS = "https://graph.facebook.com/100002021845482/albums?access_token="+API_KEY_FACEBOOK+"&format=json";
/** 
	Tempo de inicio do Janelas Virtuais
	@default 55000
	@type int
	*/
TEMPO_INICIO_MIDIA = 55000;
/** 
	Tempo de atualização em milisegundos do Janelas Virtuais
	@type int
	@default 90000
	*/
TEMPO_REFRESH_MIDIA = 50000;
/** 
	Tempo de atualização de abas do Janelas virtuais. (Milisegundos)
	@type int
	@default 90000
	*/
TEMPO_REFRESH_ABAS = 50000;
/** 
	Tempo de atualização da previsão do tempo. (Milisegundos)
	@default 90000
	@type int
	*/
TEMPO_REFRESH_WEATHER = 90000;
