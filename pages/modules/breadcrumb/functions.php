<?

	function find_elem_in_menu($menu, $find) {
		
		for ($i=0, $n=count($menu); $i<$n; $i++) {
			$elem = $menu[$i];
			if ( $elem["href"] == $find ) {
				return $elem;
			}
			
			if ( isset($elem["menu"]) ) {
				$result = find_elem_in_menu($elem["menu"], $find);
				if ( $result ) {
					$result["parent"] = $elem;
					return $result;
				}
			}
		}
		return false;
	}
	
	function get_elem_parents($menu, $find, $parents = array()) {
		
		for ($i=0, $n=count($menu); $i<$n; $i++) {
			$elem = $menu[$i];
			if ( $elem["href"] == $find ) {
				return $parents;
			}
			
			if ( isset($elem["menu"]) ) {
				if ( find_elem_in_menu($elem["menu"], $find) ) {
					$parents[] = array(
						"title" => $elem["title"],
						"href" => $elem["href"]
					);
					
					return get_elem_parents($elem["menu"], $find, $parents);
				}
			}
		}
	
		return $parents;
	}