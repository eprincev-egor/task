<?
	global  $serv, 
			$uri, 
			$pages_dir, 
			$config, 
			$template_name, 
			$template_Name, 
			$route_config,
			$title,
			$lang,
			$lang_texts;
	
	$lang = "rus";
	if ( isset($_COOKIE["lang"]) ) {
		$lang = $_COOKIE["lang"];
	}
	if ( isset($_GET["lang"]) ) {
		setcookie('lang', $_GET["lang"]);
		$lang = $_GET["lang"];
	}
	
	$serv = $_SERVER["DOCUMENT_ROOT"];
	$uri = $_SERVER["REQUEST_URI"];
	$uri = explode("?", $uri);
	$uri = $uri[0];
	$uri_parts = explode("/", $uri);
	
	if ( $uri == "" || $uri == "/" ) {
		$uri = "/main/";
	}
	
	$pages_dir = "/pages";
	
	$config = file_get_contents($serv."{$pages_dir}/config.json");
	$lang_texts = json_decode(file_get_contents($serv."{$pages_dir}/lang.json"), true);
	$config = json_decode($config, true);
	$title = "";
	if ( isset($config["title"]) ) {
		$title =  $config["title"];
	}
	
	if ( $uri_parts[1] != "api" ) {
		$route_config = array();
		if ( isset($config["routes"]) ) {
			$route_config = (array)$config["routes"];
			if ( isset($route_config[$uri]) ) {
				$route_config = (array)$route_config[$uri];
			} else {
				$route_config = array();
			}
		}
		
		if ( isset($route_config["title"]) ) {
			$title =  $route_config["title"];
		}
		
		$template_name = "main";
		if ( isset($route_config["template"]) ) {
			$_template_name = $route_config["template"];
			if ( file_exists($serv."{$pages_dir}/{$_template_name}.php") ) {
				$template_name = $_template_name;
			}
		}
		$template_Name = strtoupper(substr($template_name, 0, 1)) . substr($template_name, 1);
		
		include "{$serv}{$pages_dir}/{$template_name}.php";
	} else {
		$uri = preg_replace("/\\/$/", "", $uri);
		include "{$serv}{$uri}.php";
	}
	
// ================
// ================
//  Helpers::
// ================
// ================

function inc($name, $params = array()) {
	global  $serv, 
			$uri, 
			$pages_dir, 
			$config, 
			$template_name, 
			$template_Name, 
			$route_config,
			$title,
			$lang,
			$lang_texts;
	
	include "{$serv}{$pages_dir}/inc/{$name}.php";
}

function content($name) {
	global $serv, $pages_dir, $uri, $route_config,
			$lang,
			$lang_texts;
	$content_file = "{$serv}{$pages_dir}/content{$uri}{$name}.php";
	
	if ( isset($route_config["content"]) ) {
		$contents = (array)$route_config["content"];
		if ( isset($contents[$name]) ) {
			echo translateMe($contents[$name]);
			return;
		}
	}
	
	if ( file_exists($content_file) ) {
		include $content_file;
	}
}

function inc_module($name, $params = array()) {
	global $serv, $pages_dir, $route_config, $config,
			$lang,
			$lang_texts;
	$module_dir = "{$serv}{$pages_dir}/modules/{$name}";
	$module_file = "{$module_dir}/index.php";
	$functions_file = "{$module_dir}/functions.php";
	
	if ( file_exists($functions_file) ) {
		require_once($functions_file);
	}
	
	if ( file_exists($module_file) ) {
		include $module_file;
	}
}


function send_mail($mail, $subject, $text) {
	//iconv('utf-8', 'windows-1251', );
	
	$to = "<{$mail}>";

	
	$subject = $subject;

	/* сообщение */
	$message = "
	<html>
	<head>
	 <title>{$subject}</title>
	</head>
	<body>
	{$text}
	</body>
	</html>
	";

	/* Для отправки HTML-почты вы можете установить шапку Content-type. */
	$headers= "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html; charset=windows-1251\r\n";

	/* дополнительные шапки */
	$headers .= "From: LifeQuest.city\r\n";

	/* и теперь отправим из */
	return mail($to, iconv('utf-8', 'windows-1251', $subject), iconv('utf-8', 'windows-1251', $message), $headers);
}

function translateMe($text) {
	global $lang_texts, $lang;
	
	if ( !isset($lang_texts[$lang]) ) {
		return $text;
	}
	
	if ( !isset($lang_texts[$lang][$text]) ) {
		return $text;
	}
	
	return $lang_texts[$lang][$text];
}

function getDBH() {
	$user = "045920029_task";
	$name = "j273961_task";
	$pass = "task1998";
	$host = "localhost";
	$charset = "UTF-8";
	
	return new PDO("mysql:host=$host;dbname=$name;charset=$charset", $user, $pass);
}

function runSQL($sql, $exec = array()) {
	$dbh = getDBH();
	$sth = $dbh->prepare($sql);
	$sth->execute($exec);
	return $sth;
}

function runSQLfetchAll($sql, $exec = array()) {
	return runSQL($sql, $exec)->fetchAll(PDO::FETCH_ASSOC);
}