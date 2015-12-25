<?
	
	runSQL("UPDATE user SET name = :name WHERE id = :id", array(
		":id" => $_GET["id"],
		":name" => $_GET["name"]
	));
	
	echo json_encode(array(
		"status" => "success"
	));