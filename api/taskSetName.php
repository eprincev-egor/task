<?
	$id = $_GET["id"];
	$name = $_GET["name"];
	
	runSQL("UPDATE task SET name = :name WHERE id = :id", array(
		":name" => $name,
		":id" => $id
	));
	
	echo json_encode(array(
		"status" => "success"
	));
