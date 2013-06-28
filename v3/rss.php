<?php
//$conn = mysql_connect('143.107.231.32', 'janelasvirtuais', 'w!nd0wsd!g');
$conn = mysql_connect('localhost', 'janelasvirtuais', 'w!nd0wsd!g');
mysql_select_db('webUSP',$conn) or die("Não foi possível conectar ao banco MySQL<br>".mysql_error());
if (!$conn) {echo "Não foi possível conectar ao banco MySQL.<br>".mysql_error();
	exit ;
} else {echo "Parabéns!! A conexão ao banco de dados ocorreu normalmente!.
";
}
mysql_close();
?>
