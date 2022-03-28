var MAIN = (function() {	
    /* ***************************************************************************
     *                           VARIABLES PRIVADAS                              *
     *****************************************************************************/
	var ret = {};

    /* ***************************************************************************
     *                    MÓDULOS PRINCIPALES  (VARIABLES PÚBLICAS)              *
     *****************************************************************************/
	ret.modelo = {}; //Acceso a entidades
    ret.utils = {}; //Utilidades
	ret.ws = {}; //Servicios web

    ret.clickEvent = ($.support.touch ? "tap" : "click");

    //ret.entorno = "DEV";
    ret.entorno = "PROD";
    ret.keyLocalStorageDatosCobertura = "keyLocalStorageDatosCObertura";
    ret.timeoutTestDeVelocidad = 210000; //tres minutos y medio.
    ret.timeoutTestBajada = 40000;
    ret.timeoutTestSubida = 50000;

    return ret;
}());