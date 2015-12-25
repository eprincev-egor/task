<?
	$dbh = getDBH();
	$sth = $dbh->prepare("INSERT INTO user (name) VALUES (:name)");
	$sth->execute(array(
		":name" => ""
	));
	
	$id = $dbh->lastInsertId();
	
	echo json_encode(array(
		"id" => $id
	));