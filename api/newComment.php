<?
	$id_task = $_POST["id_task"];
	$id_user = $_POST["id_user"];
	$message = $_POST["message"];
	$date = time() * 1000;
	
	$dbh = getDBH();
	$sth = $dbh->prepare("INSERT INTO comment (id_user, id_task, message, date) VALUES (:id_user, :id_task, :message, :date)");
	$sth->execute(array(
		":id_user" => $id_user,
		":id_task" => $id_task,
		":message" => $message,
		":date" => $date
	));
	
	$id = $dbh->lastInsertId();
	
	echo json_encode(array(
		"id" => $id
	));