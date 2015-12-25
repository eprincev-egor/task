				<ol class="breadcrumb">
				  <li><a href="/"><? echo translateMe("Главная"); ?></a></li>
<?
	global $uri;
	$breadcrumb_menu = get_elem_parents($config["menu"]["main"], $uri);

	for ($i=0, $n=count($breadcrumb_menu); $i<$n; $i++) {
		echo "<li><a href='".$breadcrumb_menu[$i]["href"]."'>".translateMe($breadcrumb_menu[$i]["title"])."</a></li>";
	}
?>

				  <li class="active"><? content("name"); ?></li>
				</ol>