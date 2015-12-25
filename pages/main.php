<!DOCTYPE html>
<html class='no-js' lang=''>
	<head>
		<? inc("head"); ?>
	</head>
	<body>

	<? inc("header"); ?>
	
	<div class='container'>
		<div class="user-name"><input placeholder="User" value=""/></div>
		
		<div class="main-task col-xs-8">
			<div class="task-info">
				<h1 class="time col-xs-8">00:00:00:00</h1>
				
				<div class="task-name col-xs-8">
					<input placeholder="Task name"/>
				</div>
				
				<div class="new-comment col-xs-8">
					<textarea class="col-xs-12" placeholder="Comment"></textarea>
					<div></div>
					<button class="btn btn-success" style="float:right;">send</button>
				</div>
				
				<div class="btns col-xs-4">
					<div class="task-btn play"></div>
					<div class="task-btn pause"></div>
					<div class="task-btn stop"></div>
					<div class="task-btn create"></div>
				</div>
				
			</div>
			
			<div class="comments col-xs-12">
			</div>
		</div>
		
		<div class="active-tasks col-xs-4"></div>
	</div>

	<? inc("footer"); ?>
	<? inc("scripts"); ?>
	</body>
</html>
