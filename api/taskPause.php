<?
	$id = $_GET["id"];
	
	$pause_date = time() * 1000;
	runSQL("UPDATE task SET pause_date = :pause_date WHERE id = :id", array(
		":id" => $id,
		":pause_date" => $pause_date
	));
	
	echo json_encode(array(
		"pause_date" => $pause_date
	));
