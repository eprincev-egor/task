define([
	"funcs",
	"eva",
	"jquery"
], function(f, Events, $) {
	
	var MainApp = f.CreateClass("MainApp", {}, Events);
	
	MainApp.prototype.init = function(params) {
		params = params || {};
		for (var key in params) {
			this[key] = params[key];
		}
		
		// some inits...
		this.initUser();
		this.initMainTask();
		this.initActiveTasks();
	};
	
	MainApp.prototype.apiNewUser = function(callback) {
		$.get("/api/newUser", function(result) {
			result = JSON.parse(result);
			callback(result.id);
		});
	};
	
	MainApp.prototype.apiSetUserName = function(id, name, callback) {
		$.get("/api/setUserName?name=" + name + "&id=" + id, function(result) {
			result = JSON.parse(result);
			if ( callback ) {
				callback(result.name);
			}
		});
	};
	
	MainApp.prototype.initUser = function() {
		this.$userNameInput = $(".user-name input");
		this.$userNameInput.on("input", this.onInputUserNameChange.bind(this));
		
		var userId = +localStorage.getItem("userId"),
			userName = localStorage.getItem("userName") || "";
		
		if ( userId ) {
			this.applyUser(userId, userName);
		} else {
			this.apiNewUser(function(id) {
				localStorage.setItem("userId", id);
				this.applyUser(id, userName);
			}.bind(this));
		}
	};
	
	MainApp.prototype.onInputUserNameChange = function(e) {
		var newName = this.$userNameInput.val();
		
		localStorage.setItem("userName", newName);
		this.apiSetUserName(this.userId, newName);
	};
	
	MainApp.prototype.applyUser = function(id, name) {
		this.userId = id;
		this.userName = name;
		this.$userNameInput.val(name);
	};
	
	MainApp.prototype.apiGetUserActiveTasks = function(id, callback) {
		$.get("/api/getUserActiveTasks?id=" + id, function(result) {
			result = JSON.parse(result);
			result.tasks.forEach(this.processServerTask, this);
			callback(result.tasks);
		}.bind(this));
	};
	
	MainApp.prototype.apiTaskPlay = function(id, callback) {
		$.get("/api/taskPlay?id=" + id, function(result) {
			result = JSON.parse(result);
			this.processServerTask(result.task);
			callback(result.task);
		}.bind(this));
	};
	
	MainApp.prototype.apiTaskPause = function(id, callback) {
		$.get("/api/taskPause?id=" + id, function(result) {
			result = JSON.parse(result);
			callback(+result.pause_date);
		});
	};
	
	MainApp.prototype.apiTaskStop = function(id, callback) {
		$.get("/api/taskStop?id=" + id, function(result) {
			result = JSON.parse(result);
			callback(+result.stop_date);
		});
	};
	
	MainApp.prototype.apiNewTask = function(userId, name, callback) {
		$.get("/api/newTask?id_user=" + userId + "&name=" + name, function(result) {
			result = JSON.parse(result);
			callback(+result.id);
		});
	};
	
	MainApp.prototype.apiTaskSetName = function(id, name, callback) {
		if ( !callback ) {
			callback = function() {}
		}
		
		$.get("/api/taskSetName?name=" + name + "&id=" + id, function(result) {
			result = JSON.parse(result);
			callback(result.status);
		});
	};
	
	MainApp.prototype.initMainTask = function() {
		this.$taskNameInput = $(".main-task .task-name input");
		this.$taskCommentTextarea = $(".main-task .new-comment textarea");
		this.$taskSendComment = $(".main-task .new-comment button");
		this.$commentsBox = $(".comments");
		this.comments = [];
		this.$taskPlayBtn = $(".main-task .task-btn.play");
		this.$taskPauseBtn = $(".main-task .task-btn.pause");
		this.$taskStopBtn = $(".main-task .task-btn.stop");
		this.$taskCreateBtn = $(".main-task .task-btn.create");
		
		this.$taskPlayBtn.on("click", this.onClickTaskPlayBtn.bind(this));
		this.$taskPauseBtn.on("click", this.onClickTaskPauseBtn.bind(this));
		this.$taskStopBtn.on("click", this.onClickTaskStopBtn.bind(this));
		this.$taskCreateBtn.on("click", this.onClickTaskCreateBtn.bind(this));
		
		this.$taskSendComment.on("click", this.onClickTaskSendComment.bind(this));
		
		this.$mainTime = $(".task-info .time");
		
		this.$taskNameInput.on("input", this.onInputTaskNameInput.bind(this));
		
		var mainTask = false,
			mainTaskFromStorage = localStorage.getItem("mainTask");
		
		try {
			mainTask = JSON.parse(mainTaskFromStorage);
		} catch(e) {}
		
		if ( mainTask ) {
			this.taskToMain(mainTask);
		}
	};
	
	MainApp.prototype.taskToMain = function(task) {
		this.mainTask = task;
		this.processServerTask(task);
		this.clearComments();
		this.comments = [];
		
		this.$taskNameInput.val(task.name);
		
		if ( task.pause_date <= 0 ) {
			this.playTask(task);
		} else {
			var pause_summ = task.pause_summ;
			var diff = Date.now() - task.pause_date;
			pause_summ += diff;
			
			this.mainTimerFrame(task.start_date + pause_summ);
		}
		
		this.saveMainTaskToStorage();
		this.loadAndDrawComments(task.id);
	};
	
	MainApp.prototype.onInputTaskNameInput = function() {
		if ( !this.mainTask ) {
			return;
		}
		
		var id = this.mainTask.id;
		var name = this.$taskNameInput.val();
		this.mainTask.name = name;
		this.apiTaskSetName(id, name);
		this.saveMainTaskToStorage();
	};
	
	MainApp.prototype.apiGetTaskData = function(id, callback) {
		$.get("/api/getTaskData?id=" + id, function(result) {
			result = JSON.parse(result);
			this.processServerTask(result.task);
			callback(result.task);
		}.bind(this));
	};
	
	// CREATE
	MainApp.prototype.onClickTaskCreateBtn = function(e) {
		e.preventDefault();
		
		clearInterval( this._mainTimerInterval );
		this.$taskNameInput.val("");
		this.clearComments();
		this.$mainTime.html("00:00:00:00");
		this.apiNewTask(this.userId, "", function(id) {
			this.apiGetTaskData(id, function(task) {
				this.mainTask = task;
				this.activeTasks.unshift(this.mainTask);
				this.drawActiveTasks(this.activeTasks);
				this.saveMainTaskToStorage();
			}.bind(this));
		}.bind(this));
	};
	
	// PLAY
	MainApp.prototype.onClickTaskPlayBtn = function(e) {
		e.preventDefault();
		var name = "",
			inputValue = this.$taskNameInput.val();
		
		if ( inputValue ) {
			name = inputValue;
		}
		
		// создаем новое задание
		if ( !this.mainTask ) {
			this.apiNewTask(this.userId, name, function(id) {
				this.mainTask = {
					id: id, 
					id_user: this.userId
				};
				
				this.playTask(this.mainTask, function() {
					this.saveMainTaskToStorage();
					this.activeTasks.unshift(this.mainTask);
					this.drawActiveTasks(this.activeTasks);
				}.bind(this));
			}.bind(this));
			return;
		}
		
		this.playTask(this.mainTask, this.saveMainTaskToStorage.bind(this));
	};
	
	MainApp.prototype.playTask = function(task, callback) {
		if ( !f.isFunction(callback) ) {
			callback = function() {};
		}
		
		var id = task.id;
		
		this.apiTaskPlay(id, function(newTask) {
			for (var key in newTask) {
				task[key] = newTask[key];
			}
			
			this.runMainTimer(task.start_date + task.pause_summ);
			callback(task);
		}.bind(this));
	};
	
	// строки в числа где это нужно
	MainApp.prototype.processServerTask = function(row) {
		row.pause_summ *= 1;
		row.pause_date *= 1;
		row.start_date *= 1;
		row.stop_date *= 1;
		row.id *= 1;
		row.id_task *= 1;
		row.id_user *= 1;
	};
	
	MainApp.prototype.runMainTimer = function(unixTime) {
		clearInterval(this._mainTimerInterval);
		
		this._mainTimerInterval = setInterval(this.mainTimerFrame.bind(this, unixTime), 500);
		this.mainTimerFrame();
	};
	
	MainApp.prototype.mainTimerFrame = function(unixTime) {
		
		var current = Date.now();
		var diff = current - unixTime;
		
		var days = Math.floor( diff / 1000 / 60 / 60 / 24 );
		var hours = Math.floor( diff / 1000 / 60 / 60 ) - days * 24;
		var minutes = Math.floor( diff / 1000 / 60 ) - days * 24 * 60 - hours * 60;
		var seconds = Math.floor( diff / 1000 ) - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
		
		if ( seconds < 10 ) {
			seconds = "0" + seconds;
		}
		if ( minutes < 10 ) {
			minutes = "0" + minutes;
		}
		if ( hours < 10 ) {
			hours = "0" + hours;
		}
		if ( days < 10 ) {
			days = "0" + days;
		}
		
		if ( f.isNaN(days) ) {
			days = "00";
		}
		
		if ( f.isNaN(hours) ) {
			hours = "00";
		}
		
		if ( f.isNaN(minutes) ) {
			minutes = "00";
		}
		
		if ( f.isNaN(seconds) ) {
			seconds = "00";
		}
		
		this.$mainTime.html(days + ":" + hours + ":" + minutes + ":" + seconds);
	};
	
	// PAUSE
	MainApp.prototype.onClickTaskPauseBtn = function(e) {
		e.preventDefault();
		if ( !this.mainTask ) {
			return;
		}
		
		this.pauseTask(this.mainTask, function() {
			this.saveMainTaskToStorage();
		}.bind(this));
	};
	
	MainApp.prototype.pauseTask = function(task, callback) {
		if ( !f.isFunction(callback) ) {
			callback = function(){}
		}
		
		if ( this.mainTask && task.id == this.mainTask.id ) {
			clearInterval( this._mainTimerInterval );
		}
		
		this.apiTaskPause(task.id, function(pause_date) {
			task.pause_date = pause_date;
			callback(task);
		}.bind(this));
	};
	
	MainApp.prototype.saveMainTaskToStorage = function() {
		localStorage.setItem("mainTask", JSON.stringify(this.mainTask));
		
		var index = this.activeTaskIndexOf(this.mainTask.id);
		if ( index == -1 ) {
			return;
		}
		
		this.activeTasks[index] = f.deepClone(this.mainTask);
		this.drawActiveTaskAt(index);
	};
	
	// STOP
	MainApp.prototype.onClickTaskStopBtn = function(e) {
		e.preventDefault();
		if ( !this.mainTask ) {
			return;
		}
		
		this.stopTask(this.mainTask);
	};
	
	MainApp.prototype.stopTask = function(task) {
		var id = task.id;
		if ( this.mainTask && task.id == this.mainTask.id ) {
			this.clearMainTask();
		}
			
		this.apiTaskStop(id, function(stop_date) {
			task.stop_date = stop_date;
			this.removeActiveTask(task);
			this.drawActiveTasks(this.activeTasks);
			this.clearComments();
		}.bind(this));
	};
	
	MainApp.prototype.clearMainTask = function() {
		this.$mainTime.html("00:00:00:00");
		this.mainTask = false;
		this.$taskNameInput.val("");
		this.$taskCommentTextarea.val("");
		this.saveMainTaskToStorage();
		clearInterval(this._mainTimerInterval);
	};
	
	MainApp.prototype.apiNewComment = function(id_task, id_user, message, callback) {
		$.post("/api/newComment", {
			id_task: id_task,
			id_user: id_user,
			message: message
		}, function(result) {
			result = JSON.parse(result);
			callback(result.id);
		}.bind(this));
	};
	
	MainApp.prototype.onClickTaskSendComment = function(e) {
		e.preventDefault();
		
		if ( !this.mainTask ) {
			return;
		}
		
		var message = this.$taskCommentTextarea.val();
		message = $("<div/>").text(message).html();
		if ( !message ) {
			return;
		}
		
		message = message.replace(/[\n\r]{1,2}/g, "<br/>");
		var id_task = this.mainTask.id;
		var comment = {
			date: Date.now(),
			id_task: id_task,
			id_user: this.userId,
			message: message
		};
		this.$taskCommentTextarea.val("");
		
		this.apiNewComment(id_task, this.userId, message, function(id) {
			comment.id = comment;
			this.comments.unshift(comment);
			this.drawComments(this.comments);
		}.bind(this));
	};
	
	MainApp.prototype.loadAndDrawComments = function(id_task) {
		this.apiGetTaskComments(id_task, function(comments) {
			this.comments = comments;
			this.drawComments(comments);
		}.bind(this));
	};
	
	var COMMENT_TEMPLATE = '<div class="comment">\
					<div class="user col-xs-8">{user}</div>\
					<div class="date col-xs-4">{date}</div>\
					<p class="text">{message}</p>\
				</div>';
	// пока только текущий юзер
	MainApp.prototype.drawComments = function(comments) {
		var html = [];
		
		comments.forEach(function(comment) {
			var date = f.timestamp2userdate(+comment.date);
			var commentHTML = COMMENT_TEMPLATE
				.replace(/\{user\}/gi, this.userName)
				.replace(/\{date\}/gi, date)
				.replace(/\{message\}/gi, comment.message)
			;
			
			html.push(commentHTML);
		}, this);
		
		html = html.join("");
		this.$commentsBox.html(html);
	};
	
	MainApp.prototype.clearComments = function() {
		this.$commentsBox.get(0).innerHTML = "";
	};
	
	MainApp.prototype.apiGetTaskComments = function(id_task, callback) {
		$.get("/api/getTaskComments?id_task="+id_task, function(result) {
			result = JSON.parse(result);
			callback(result.comments);
		});
	};
	
	MainApp.prototype.initActiveTasks = function() {
		this.activeTasks = [];
		this.$activeTasksBox = $(".active-tasks");
		this.$activeTasksBox.on("click", this.onClickActiveTasksBox.bind(this));
		
		this.apiGetUserActiveTasks(this.userId, function(tasks) {
			this.activeTasks = tasks;
			this.drawActiveTasks(tasks);
		}.bind(this));
	};
	
	MainApp.prototype.onClickActiveTasksBox = function(e) {
		var target = e.target,
			$target = $(target),
			$task = $target.hasClass("task-item") ? $target : $target.parents(".task-item:first");
		
		var id = $task.attr("data-id");
		var index = this.activeTaskIndexOf(id);
		var task = this.activeTasks[index];
		
		if ( !task ) {
			return;
		}
		
		this.taskToMain(task);
		this.$activeTasksBox.find(".task-item")
			.removeClass("current");
		
		$task.addClass("current");
	};
	
	MainApp.prototype.activeTaskIndexOf = function(id) {
		var index = -1;
		if ( !this.activeTasks ) {
			return -1;
		}
		
		this.activeTasks.some(function(activeTask, i) {
			if ( activeTask.id == id ) {
				index = i;
			}
		});
		
		return index;
	};
	
	MainApp.prototype.removeActiveTask = function(task) {
		var index = this.activeTaskIndexOf(task.id);
		
		if ( index != -1 ) {
			this.activeTasks.splice(index, 1);
		}
	};
	
	var ACTIVE_TASK_ITEM_TEMPLATE = '<div data-id="{id}" class="task-item col-xs-12 {currentClass}">\
				<span class="date">{date}</span>\
				<span class="name">{name}</span>\
			</div>';
	MainApp.prototype.drawActiveTasks = function(tasks) {
		
		var html = [];
		
		tasks.forEach(function(task) {
			html.push(this.getTaskHTML(task));
		}, this);
		
		html = html.join("");
		this.$activeTasksBox.html(html);
	};
	
	MainApp.prototype.getTaskHTML = function(task) {
		var date = f.timestamp2userdate(+task.start_date);
		var currentClass = this.mainTask && this.mainTask.id == task.id ? 
								"current" : "";
		if ( !+task.start_date ) {
			date = f.timestamp2userdate(Date.now());
		}
		
		var taskHTML = ACTIVE_TASK_ITEM_TEMPLATE
			.replace(/\{id\}/gi, task.id)
			.replace(/\{currentClass\}/gi, currentClass)
			.replace(/\{name\}/gi, task.name)
			.replace(/\{date\}/gi, date)
		;
		
		return taskHTML;
	};
	
	MainApp.prototype.drawActiveTaskAt = function(index) {
		var $task = this.$activeTasksBox.find(".task-item:eq("+index+")");
		var el = $task.get(0);
		var task = this.activeTasks[index];
		var html = this.getTaskHTML(task);
		try {
			el.outerHTML = html;
		} catch(e) {
			console.log(e)
		}
	};
	
	return MainApp;
})