<?

	$gallery = (array)$config["gallery"][$params["name"]];
	$type = (string)$params["type"];
	
	if ( !$type ) {
		$type = "default";
	}
	
	for ($i=0, $n=count($gallery); $i<$n; $i++) {
		$elem = $gallery[$i];
			echo "<li>";
			echo "<a href='{$elem['href']}'>";
			if ( $type == "zoom" ) {
				echo "<img src='{$elem['src']}' class='medium'>";
			}
			echo "<img src='{$elem['src']}' class='preview'>";
			echo "</a>";
			echo "<span>{$elem['text']}</span>";
			echo "</li>";
	}