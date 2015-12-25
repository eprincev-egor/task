<?
	$tasks = runSQLfetchAll("SELECT * FROM task WHERE id_user = :id AND stop_date = 0 ORDER BY id DESC", array(
		":id" => $_GET["id"]
	));
	
	echo json_encode(array(
		"tasks" => $tasks
	));