<?

	$id_user = $_GET["id_user"];
	
	$out = array();
	$out["task"] = runSQLfetchAll("SELECT * FROM task WHERE id_user = :id_user ORDER BY id DESC", array(
		":id_user" => $id_user
	));
	
	$out["comment"] = runSQLfetchAll("SELECT * FROM comment WHERE id_user = :id_user ORDER BY id DESC", array(
		":id_user" => $id_user
	));
	
	
	echo json_encode($out);