(function() {    
	var platformDetector = MAIN.utils.platformDetector;

	var platform = platformDetector.getPlatform();


	var androidModules = [
	                      "js/librerias/cordova.android.js",
	                     ];
	
	var iosModules = [
	                  "js/librerias/cordova.ios.js",
	                  ];
	
	var scriptArr = [
	              androidModules,
	              iosModules,
	             ];
	
	var phonegapCargado = false;
	
	var modules = null;
	
	switch(platform){
		case platformDetector.ANDROID: {
			modules = androidModules;
			break;
		}
		case platformDetector.IOS: {
			modules = iosModules;
			break;
		}
	}
	
	if(modules){
		console.log("Cargando phonegap y plugins para la plataforma: " + platform);
		
		for(var j = 0; j < modules.length; j++){
			loadAndExecuteScript(modules[j]);
		}				
		
		console.log("Phonegap cargado");
	}
	
	function loadAndExecuteScript(url){			
		// get some kind of XMLHttpRequest
		var xhrObj =  new XMLHttpRequest();
		// open and send a synchronous request
		xhrObj.open('GET', url, false);
		xhrObj.send('');
		// add the returned content to a newly created script tag
		var se = document.createElement('script');
		se.text = xhrObj.responseText;
		document.getElementsByTagName('head')[0].appendChild(se);
	}
}());