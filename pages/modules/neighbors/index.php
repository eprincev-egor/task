<?
require_once "{$serv}{$pages_dir}/modules/breadcrumb/functions.php";
require_once "{$serv}{$pages_dir}/modules/menu/functions.php";

global $uri;
$elem = find_elem_in_menu($config["menu"]["main"], $uri);

if ( $elem && isset($elem["parent"]) && $elem["parent"]["menu"] ) {
	echo_menu($elem["parent"]["menu"]);
} else {
	echo_menu($config["menu"]["main"]);
}
