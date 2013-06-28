<?php
function xmlentities($string) {
	$remove = array("&ldquo;","&rdquo;");
	return substr(str_replace($remove, "\"", trim(strip_tags(html_entity_decode(urldecode($string))))),0,300);
}
$now = date("r");
$output = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
            <rss xmlns:media=\"http://search.yahoo.com/mrss/\" version=\"2.0\">
                <channel>
                    <title>ICMC Eventos</title>
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
 
$sql="SELECT * FROM Eventos E JOIN TipoEventos T on E.id_tipo_eventos = T.id_tipo_eventos WHERE data_inicio>=CURRENT_DATE ORDER BY data_inicio ASC;";
$req = mysql_query($sql) or die("Error SQL !: ".$sql." - ".mysql_error());
while($post= mysql_fetch_assoc($req)) {
	$hr = explode(":",$post[horario]);
	$d = explode("-",$post[data_inicio]);
	$dt = date("r", mktime($hr[0],$hr[1],$hr[2],$d[1],$d[2],$d[0]));
	$output.='
	  <item>
		  <title >'. xmlentities($post[titulo]) .'</title>
		  <description>
			  '. xmlentities($post[descricao]) .'
		  </description>
		  <category>'.xmlentities($post[tipo_evento]).'</category>
		  <pubDate>'.$dt.'</pubDate>
		  <local>'.xmlentities($post[local]).'</local>
	  </item>
	  ';
}
mysql_close(); 

$output .= "</channel></rss>";

header("Content-Type: application/rss+xml; charset=iso-8859-1");

echo $output;
?>