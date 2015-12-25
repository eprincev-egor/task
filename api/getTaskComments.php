<?
	$comments = runSQLfetchAll("SELECT * FROM comment WHERE id_task = :id_task ORDER BY id DESC", array(
		":id_task" => $_GET["id_task"]
	));
	
	echo json_encode(array(
		"comments" => $comments
	));