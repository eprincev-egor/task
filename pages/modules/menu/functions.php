<?

	function echo_menu($menu, $lvl = 0, $className = "") {
		$lvl++;
		global $uri;
		
		
		if ( $className ) {
			echo "<ul class='level-{$lvl} {$className}'>";
		} else {
			echo "<ul class='level-{$lvl}'>";
		}
		for ($i=0, $n=count($menu); $i<$n; $i++) {
			$elem = $menu[$i];
			$isActive = $elem['href'] == $uri || $elem['href'] == "/" && $uri == "/main/";
			
			echo (
				"<li class='".
					(
					$isActive ? 
						"active" : 
						"" 
					).
					(
					isset($elem["menu"]) ? 
						" with-ul" :
						""
					).
				"'>"
			);
			echo "<a href='".$elem['href']."'>";
			echo translateMe($elem["title"]);
			echo "</a>";
			if ( isset($elem["menu"]) ) {
				echo_menu((array)$elem["menu"], $lvl);
			}
			echo "</li>";
		}
			
		echo "</ul>";
	}