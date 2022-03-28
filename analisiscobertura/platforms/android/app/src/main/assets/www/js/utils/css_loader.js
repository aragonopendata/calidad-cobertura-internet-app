(function() {
	var platformDetector = MAIN.utils.platformDetector;

	var useragent = navigator.userAgent;
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();

	
	/******************************************************************************
	*                                   META VIEWPORT                             *
	******************************************************************************/
	
	var esIOS = false;
	if((/iPhone/i.test(useragent)) || (/iPad/i.test(useragent))){
		esIOS = true;
	}
	
	//console.log("MI screenWidth: " + screenWidth);
	var scale = "1";
	if(esIOS){
		var screenRatio = window.devicePixelRatio;
		//console.log("MI screenRatio: " + screenRatio);
		if(screenRatio === 2){
			if(screenWidth > 320){
				//iPads retina
				scale = "2";
			} else {
				//iPhones retina
				scale = "1";
			}
		} else {
			if(screenWidth > 320){
				//iPads no retina
				scale = "2";
			} else {
				//iPhones no retina
				scale = "1";
			}
		}
		
		if(scale === "2"){
			loadViewport("no", scale, scale, scale, screenWidth/2, screenHeight/2);
		} else {
			loadViewport("no", scale, scale, scale, screenWidth, screenHeight);
		}				
	} else {
		/*
		screenWidth = (screenWidth * screenRatio);
		scale = "" + ((screenWidth / screenRatio) / 320);
		*/
		console.log("screenWidth: " + screenWidth);
		scale = "" + (screenWidth / 320);
		loadViewport("yes", scale, scale, scale, "device-width", "device-height");
	}
	
	/******************************************************************************
	*                                   CARGA DE CSS                              *
	******************************************************************************/
		
	//Cargamos estilos dependiendo de la altura
	var alturaCritica = 0;
	var estilosPantallaCorta = [];
	var estilosPantallaLarga = [];
	
	if(screenHeight > alturaCritica){
		loadCSS(estilosPantallaLarga);
	} else {
		loadCSS(estilosPantallaCorta);
	}
	
	
	//Cargamos estilos adicionales por plataforma
	
	//Comentado porque las regex no funcionan en IOS (-_-)	
	var rgxArr = [/Android/i, /iPhone/i, /iPad/i, /BB10/i, /Windows Phone/i];
		
	var desktopStyles = [];
	
	var androidStyles = [];
	
	var iphoneStyles = ["css/itsoft/ios/ios.css"];
	
	var ipadStyles = ["css/itsoft/ios/ios.css"];
 
    var iOS6Style = ["css/itsoft/ios/ios6.css"];
	
	var bb10Styles = [];
	
	var wp8Styles = ["x-wmapp0://www/css/itsoft/wp8/wp8.css"];
	
	var stylesArr = [
	  androidStyles,
      iphoneStyles,
      ipadStyles,
      bb10Styles,
      wp8Styles
     ];
	
	var esPlataformaMovil = false;
	
	var i = 0; 
	var j = 0;	
	
	for(i = 0; i < rgxArr.length; i++){
		if(rgxArr[i].test(useragent)){
			console.log("Cargando CSS para la plataforma: " + useragent);
			console.log("Usando CSS: " + stylesArr[i]);
 
            loadCSS(stylesArr[i]);
 
            var ver = iOSversion();
 
            if(ver[0] != -1){
                 if ((ver[0] < 7)) {
                    //alert('Ejecutando iOS 6 o menor.');
                    loadCSS(iOS6Style);
                }
            }
	
            //alert("UserAgent: " + useragent);
            esPlataformaMovil = true;
			break;
		}
	}
	
	if(!esPlataformaMovil){
		loadCSS(desktopStyles);
	}
	
	//Parche para el Scroll en Gingerbread
	if(esAndroidVersMenor3()){
		//Parche para solucionar problema con problemas en el soporte de
		//la propiedad css overflow en Gingerbread.
		//También ver:
		//http://code.google.com/p/android/issues/detail?id=6864
		//http://code.google.com/p/android/issues/detail?id=2911
		//http://stackoverflow.com/questions/8013204/android-browser-bug-div-overflow-scrolling
		loadCSS(["css/itsoft/android/gingerbread/scroll_patch.css"]);
	}
	
	
	function esAndroidVersMenor3() {
		return !!navigator.userAgent.match(/Android [1-2]/i);
	}	
	
    function iOSversion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
        var arrAux = new Array();
        arrAux.push(-1);
        return arrAux;
    }
	
	
	function loadCSS(arrayHrefs){
		var cssLink
		for(var i = 0; arrayHrefs && (i < arrayHrefs.length); i++){
			cssLink = $("<link rel='stylesheet' type='text/css' href='" + arrayHrefs[i] + "' />");
		    $("head").append(cssLink);
		}
	}
	
	function loadViewport(userScalable, initialScale, maximumScale, minimumScale, width, height){
		var content = "user-scalable=" + userScalable + ", initial-scale=" + initialScale + ", maximum-scale=" + maximumScale + ", minimum-scale=" + minimumScale;
		if(width){
			content += (", width=" + width);
		}
		if(height){
			content += (", height=" + height);
		}
				
		$('<meta />', {
		 name: 'viewport',
		 content: content
		}).appendTo('head');

	}	
}());