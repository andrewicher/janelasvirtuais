<?php
function xmlentities($string) {
	$remove = array("&ldquo;","&rdquo;");
	return substr(str_replace($remove, "\"", trim(strip_tags(html_entity_decode(urldecode($string))))),0,300);
}
$now = date("r");
$output = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
            <rss xmlns:media=\"http://search.yahoo.com/mrss/\" version=\"2.0\">
                <channel>
                    <title>ICMC Noticias</title>
                    <link>http://www.icmc.usp.br</link>
                    <description>A Test RSS</description>
                    <language>pt-br</language>
                    <pubDate>$now</pubDate>
                    <lastBuildDate>$now</lastBuildDate>
            ";
	
$local = "143.107.231.6";
$usuario = "janelasvirtuais";
$senha = "w!nd0wsd!g";
$banco = "webUSP";

$connect = mysql_connect("$local","$usuario","$senha") or die("ERRO AO CONECTAR AO MYSQL, VERIFIQUE COM O ADMINISTRADOR" . mysql_error());
mysql_select_db("$banco") or die("BASE DE DADOS INVÁLIDO");
 
$sql="SELECT * FROM Noticias N JOIN TipoNoticias T on N.id_tipo_noticias = T.id_tipo_noticias ORDER BY pubDate DESC LIMIT 15;";
$req = mysql_query($sql) or die("Error SQL !: ".$sql." - ".mysql_error());
while($post= mysql_fetch_assoc($req)) {
	$d = explode("-",$post[pubDate]);
	$dt = date("r", mktime(12,0,0,$d[1],$d[2],$d[0]));
	$output.='
<item>
<title >'.xmlentities($post[titulo]).'</title>
<description>
'.xmlentities($post[descricao]).'
</description>
<link>http://icmc.usp.br/Portal/Noticias/leituraNoticias.php?id_noticia='. $post[id_noticias] .'</link>
<category>'.xmlentities($post[tipo_noticia]).'</category>
<pubDate>'.$dt.'</pubDate>
<media:thumbnail url="'.($post[icone_noticias]!=null?"http://icmc.usp.br/CMS/Noticias/Noticias/ImagemIcone/".rawurlencode($post[icone_noticias]):null).'" />
<guid>http://icmc.usp.br/Portal/Noticias/leituraNoticias.php?id_noticia='. $post[id_noticias] .'#'.rand(0,100)*rand(0,100).'</guid>
</item>
';
}
mysql_close(); 

$output .= "</channel></rss>";

header("Content-Type: application/rss+xml; charset=iso-8859-1");
echo $output;
?>