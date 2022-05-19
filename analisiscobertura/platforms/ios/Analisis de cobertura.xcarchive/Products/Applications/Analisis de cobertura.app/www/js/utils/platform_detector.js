MAIN.utils.platformDetector = (function() {
	var ret = {};
	
	ret.DESCONOCIDO = 0;
	ret.ANDROID = 1;
	ret.IOS = 2;
	ret.BLACKBERRY_10 = 3;	
	ret.WINDOWS_PHONE = 4;
    ret.WINDOWS = 5;
    ret.OSX = 6;
    ret.LINUX = 7;
	
	/**
	 * Detecta la plataforma en función del user agent del navegador.
	 * @returns Number. Una de las constantes en este mismo módulo.
	 */
	ret.getPlatform = function(){		
		var useragent = navigator.userAgent;		
		
		var rgxArr = [/Android/i, /iPhone/i, /iPad/i, /BB10/i, /Windows Phone/i, /Windows/i, /Macintosh/i, /Linux/i];
		var typeArr = [ret.ANDROID, ret.IOS, ret.IOS, ret.BLACKBERRY_10, ret.WINDOWS_PHONE, ret.WINDOWS, ret.OSX, ret.LINUX];
		for(var i = 0; i < rgxArr.length; i++){
			if(rgxArr[i].test(useragent)){
				return typeArr[i];
			}
		}	
		
		return ret.DESCONOCIDO;		
	};

	ret.getModel = function(){
		var res = "";
		var useragent = navigator.userAgent;		
		
		var aux = useragent.split("; ");
		var textoModeloAux = aux[2];
		if (textoModeloAux) {
			res = textoModeloAux;
			let posParentesis = res.indexOf(")");
			if (posParentesis > 0) {
				res = res.substring(0, posParentesis);
				let posBuild = res.indexOf(" Build");
				if (posBuild > 0) {
					res = res.substring(0, posBuild);
				}
			} else {
			    let posBuild = res.indexOf(" Build");
                if (posBuild > 0) {
                    res = res.substring(0, posBuild);
                }
			}
		}
		
		return res;
	};

	/**
	 * Detecta si el navegador es móvil en función del user agent.
	 * @returns Boolean. true si es un navegador móvil, false en otro caso.
	 */
	ret.isMobile = function(){
		return ((ret.getPlatform() !==  ret.WINDOWS) && (ret.getPlatform() !==  ret.OSX) && (ret.getPlatform() !==  ret.LINUX));
	};
	
	return ret;
}());