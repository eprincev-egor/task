<?
require_once "{$serv}{$pages_dir}/modules/breadcrumb/functions.php";
require_once "{$serv}{$pages_dir}/modules/menu/functions.php";

global $uri;
$menu_name = "main";
if ( isset($params["name"]) && isset($config["menu"][$params["name"]]) ) {
	$menu_name = $params["name"];
}
$menu = (array)$config["menu"][$menu_name];

$elem = find_elem_in_menu($menu, $uri);

if ( $elem && $elem["menu"] ) {
	echo_menu($elem["menu"]);
}
