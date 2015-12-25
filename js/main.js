;(function() {
	"use strict";

	require([
		"require-config"
	], function() {
		require([
			"classes/GlobalApp",
			document.getElementById("main-script").getAttribute("data-boost-app")
		], function(GlobalApp, MainApp) {

			window.global = new GlobalApp({

			});

			window.app = new MainApp({

			});
		});
	});

})();
