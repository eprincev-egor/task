<?
	$id = $_GET["id"];
	
	$task = runSQLfetchAll("SELECT * FROM task WHERE id = :id", array(
		":id" => $id
	));
	$task = $task[0];
	
	$current_date = time() * 1000;
	
	if ( $task["start_date"] * 1 > 0 ) {
		// если задача уже была запущена, то перещитаем ей время в пауз
		$pause_summ = +$task["pause_summ"];
		$pause_date = +$task["pause_date"];
		
		if ( $pause_date * 1 > 0 ) {
			$diff = $current_date - $pause_date;
		} else {
			$diff = 0;
		}
		
		$pause_summ += $diff;
		
		runSQL("UPDATE task SET pause_date = 0, pause_summ = :pause_summ WHERE id = :id", array(
			":id" => $id,
			":pause_summ" => $pause_summ
		));
		
		$task["pause_date"] = 0;
		$task["pause_summ"] = +$pause_summ;
	} else {
		// если задача ни разу не была запущена, то сетим ей дату начала
		runSQL("UPDATE task SET pause_date = 0, start_date = :start_date WHERE id = :id", array(
			":id" => $id,
			":start_date" => $current_date
		));
		
		$task["start_date"] = +$current_date;
		$task["pause_date"] = 0;
	}
	
	echo json_encode(array(
		"task" => $task
	));