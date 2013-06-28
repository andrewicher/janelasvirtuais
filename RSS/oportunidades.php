<?php
function xmlentities($string) {
	$remove = array("&ldquo;","&rdquo;");
	return substr(str_replace($remove, "\"", trim(strip_tags(html_entity_decode(urldecode($string))))),0,300);
}
$now = date("r");
$output = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
            <rss xmlns:media=\"http://search.yahoo.com/mrss/\" version=\"2.0\">
                <channel>
                    <title>ICMC Oportunidades</title>
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
 
$sql="SELECT * FROM Oportunidades O JOIN TipoOportunidades T ON O.id_tipo_oportunidades = T.id_tipo_oportunidades ORDER BY pubDate DESC LIMIT 15;";
$req = mysql_query($sql);
while($post= mysql_fetch_array($req,MYSQL_ASSOC)) {
	$d = explode("-",$post[pubDate]);
	$dt = date("r", mktime(12,0,0,$d[1],$d[2],$d[0]));
	$output.='
<item>
<title >'.xmlentities($post[titulo]) .'</title>
<description>
'. xmlentities($post[descricao]) .'
</description>
<link>'. $post[url] .'</link>
<category>'.xmlentities($post[tipo_oportunidade]).'</category>
<pubDate>'.$dt.'</pubDate>
<media:thumbnail url="'.($post[icone_oportunidades]!=null?"http://www.icmc.usp.br/CMS/Oportunidades/Oportunidades/ImagemIcone/".rawurlencode($post[icone_oportunidades]):null).'" />
<guid>'. $post[url].'</guid>
</item>
';
}
mysql_free_result($req);
mysql_close(); 

$output .= "</channel></rss>";

header("Content-Type: application/rss+xml; charset=iso-8859-1");
echo $output;
?>