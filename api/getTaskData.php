<?
	$task = runSQLfetchAll("SELECT * FROM task WHERE id = :id", array(
		":id" => $_GET["id"]
	));
	$task = $task[0];
	
	echo json_encode(array(
		"task" => $task
	));