<?php

$noticias_feed = 'http://janelasvirtuais.icmc.usp.br/rss/noticias.php';
$eventos_feed = 'http://janelasvirtuais.icmc.usp.br/rss/eventos.php';
$oportunidades_feed = 'http://janelasvirtuais.icmc.usp.br/rss/oportunidades.php';

$noticias_file = "noticias_feed.xml";
$eventos_file = "eventos_feed.xml";
$oportunidades_file = "oportunidades_feed.xml";
$teste_file = "teste_file.xml";

copy($noticias_feed,$noticias_file);
copy($eventos_feed,$eventos_file);
copy($oportunidades_feed,$oportunidades_file);

$teste = file_get_contents($noticias_feed);
mb_convert_encoding($teste, "ISO-8859-1");
file_put_contents($teste_file,$teste);





?>