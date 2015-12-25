<?
	$menu_name = "main";
	if ( isset($params["name"]) && isset($config["menu"][$params["name"]]) ) {
		$menu_name = $params["name"];
	}
	$menu = (array)$config["menu"][$menu_name];
	
	echo_menu($menu, 0, (string)$params["className"]);
	
	
	