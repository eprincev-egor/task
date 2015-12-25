define([
	"funcs",
	"eva",
	"jquery"
], function(f, Events, $) {
	var $body = $(document.body);

	var GlobalApp = f.CreateClass("GlobalApp", {}, Events);

	GlobalApp.prototype.init = function(params) {
		params = params || {};
		for (var key in params) {
			this[key] = params[key];
		}

		// some inits...
	};

	return GlobalApp;
})
