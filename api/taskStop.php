<?
	$id = $_GET["id"];
	
	$stop_date = time() * 1000;
	runSQL("UPDATE task SET stop_date = :stop_date WHERE id = :id", array(
		":id" => $id,
		":stop_date" => $stop_date
	));

	echo json_encode(array(
		"stop_date" => $stop_date
	));
