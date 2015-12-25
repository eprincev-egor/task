<?
	$id_user = $_GET["id_user"];
	$name = "";
	if ( isset($_GET["name"]) ) {
		$name = $_GET["name"];
	}
	
	$dbh = getDBH();
	$sth = $dbh->prepare("INSERT INTO task (id_user, name) VALUES (:id_user, :name)");
	$sth->execute(array(
		":id_user" => $id_user,
		":name" => $name
	));
	
	$id = $dbh->lastInsertId();
	
	echo json_encode(array(
		"id" => $id
	));