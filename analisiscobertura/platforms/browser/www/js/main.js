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
    ret.controladores = {}; //Controladores

    ret.clickEvent = ($.support.touch ? "tap" : "click");

    ret.localizacionParaDebug = false; //FIXME: Poner a false cuando se generen versiones para Aragón.
    ret.esVersionWeb = false; //FIXME: Poner a true si generamos la versión Browser. Poner a false si generamos la versión de la App para Android o iOS.

    //ret.entorno = "DEV";
    //ret.urlWS = "https://wsdevcobertura.itsoft.es/api";
    //ret.urlFicheroTestVelBajada = "https://d.itsoft.es/aragon/filedownload1.txt";


    ret.entorno = "DEV_ARAGON";
    ret.urlWS = "https://desopendataei2a.aragon.es/cobertura/ws-cobertura/api";
    ret.urlFicheroTestVelBajada = "https://desopendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt";


    //ret.entorno = "PRE_ARAGON";
    //ret.urlWS = "https://preopendataei2a.aragon.es/cobertura/api/api";
    //ret.urlFicheroTestVelBajada = "https://preopendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt";

    //ret.entorno = "PROD_ARAGON";
    //ret.urlWS = "https://opendataei2a.aragon.es/cobertura/ws-cobertura/api";
    //ret.urlFicheroTestVelBajada = "https://opendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt";

    //ret.entorno = "DEV";
    //ret.urlWS = "http://104.199.101.9:8067/ws-cobertura/api";
    //ret.urlFicheroTestVelBajada = "https://opendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt";
    


    ret.keyLocalStorageDatosCobertura = "keyLocalStorageDatosCObertura"; //Último reporte de de datos de cobertura capturado.
    ret.keyLSDatosCoberturaPendientesSubida = "keyLSDatosCoberturaPendientesSubida"; // Array de reportes de datos de cobertura pendientes de subir.
    ret.keyLSDatosCoberturaPendientePersistir = "keyLSDatosCoberturaPendientePersistir"; //Último reporte de de datos de cobertura capturado guardado en esta otra key porque está pendiente de ser guardado en "keyLSDatosCoberturaPendientesSubida".
    ret.timeoutLocalizacion = 20000; //20 segundos.
    ret.timeoutTestDeVelocidad = 60000; //Un minuto.
    ret.timeoutTestDeVelocidadSinConexion = 10000; //10 segundos.
    ret.timeoutTestBajada = 40000;
    ret.timeoutTestSubida = 50000;

    //ret.sincronizandoReportes = false; //En vez de usar la variable MAIN.sincronizandoReportes que se inicializa cada vez que se carga el fichero main.js en todas las pantalla, usar una key en localStorage.
    ret.getSincronizandoReportes = function() {
        var valAux = sessionStorage.getItem("keySincronizandoReportes");
        if (valAux && (valAux === "true")) {
            return true;
        } else {
            return false;
        }
    }
    ret.setSincronizandoReportesTrue = function() {
        sessionStorage.setItem("keySincronizandoReportes", true);
    }
    ret.setSincronizandoReportesFalse = function() {
        sessionStorage.setItem("keySincronizandoReportes", false);
    }

    //Por ahora no usamos esta función.
    ret.realizarCambioDePantalla = function(pantalla) {
        document.location = pantalla;
    }

    var w;
    var procesoSincOk = function() {
        console.log('Sincronización reportes en background ejecutanda Ok.');
        guardarReporteActEnPersistenciaSihay();
    }
    var procesoSincKo = function() {
        console.log('Sincronización reportes en background ejecutanda con fallo.');
        guardarReporteActEnPersistenciaSihay();
    }
    var guardarReporteActEnPersistenciaSihay = function() {
        //Almaceno el reporte actual en en el persisten storege de reportes pendientes de subida:
        var miArrayDatosCoberturaString = localStorage.getItem(MAIN.keyLSDatosCoberturaPendientesSubida);
        if (miArrayDatosCoberturaString && (miArrayDatosCoberturaString !== "")) {
            var arrayDatosCoberturaAux = JSON.parse(miArrayDatosCoberturaString);
            guardarEnPersistentStorage(arrayDatosCoberturaAux);
        } else {
            var arrayDatosCoberturaNuevo = new Array();
            guardarEnPersistentStorage(arrayDatosCoberturaNuevo);
        }
    }
    var guardarEnPersistentStorage = function(arrayDatosCobertura) {
        var misDatosCoberturaString = localStorage.getItem(MAIN.keyLSDatosCoberturaPendientePersistir);
        if (misDatosCoberturaString && (misDatosCoberturaString !== "")) {
            console.log('Guardando el reporte pendiente de persistir.');
            var datosCoberturaAux = JSON.parse(misDatosCoberturaString);
            arrayDatosCobertura.unshift(datosCoberturaAux);
            localStorage.setItem(MAIN.keyLSDatosCoberturaPendientesSubida, JSON.stringify(arrayDatosCobertura));
            localStorage.removeItem(MAIN.keyLSDatosCoberturaPendientePersistir);
        }
        MAIN.setSincronizandoReportesFalse();
    }

    if(typeof(Worker) !== "undefined") {
        try {
            if (typeof(w) == "undefined") {
                w = new Worker("js/controladores/sinc_reportes_worker.js");
            }
            w.onmessage = function(event) {
                if (event.data.toString() === "1") {
                    console.log('Justo al arrancar el worker no hacemos nada.');
                } else {
                    if (MAIN.getSincronizandoReportes()) {
                        console.log('No ejecutamos sincronización reportes en MAIN porque ya se estaban sincronizando reportes.');
                        //A la siguiente sí se ejecuta la sincronización.
                        MAIN.setSincronizandoReportesFalse();
                    } else {
                        if (MAIN.controladores.sincronizadorReportes) {
                            MAIN.setSincronizandoReportesTrue();
                            console.log('Ejecutando sincronización reportes MAIN.');
                            MAIN.controladores.sincronizadorReportes.enviarReportesPendientes(
                                procesoSincOk,
                                procesoSincKo
                            );
                        } else {
                            MAIN.setSincronizandoReportesFalse();
                        }
                    }
                }
            };
        } catch (error) {
            console.error("No se ha podido inicializar el worker!");
        }
    }

    return ret;
}());
