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

    //ret.entorno = "DEV";
    ret.entorno = "PRUEBAS_ARAGON";
    //ret.entorno = "PROD";
    ret.keyLocalStorageDatosCobertura = "keyLocalStorageDatosCObertura"; //Último reporte de de datos de cobertura capturado.
    ret.keyLSDatosCoberturaPendientesSubida = "keyLSDatosCoberturaPendientesSubida"; // Array de reportes de datos de cobertura pendientes de subir.
    ret.keyLSDatosCoberturaPendientePersistir = "keyLSDatosCoberturaPendientePersistir"; //Último reporte de de datos de cobertura capturado guardado en esta otra key porque está pendiente de ser guardado en "keyLSDatosCoberturaPendientesSubida".
    ret.timeoutTestDeVelocidad = 210000; //tres minutos y medio.
    ret.timeoutTestBajada = 40000;
    ret.timeoutTestSubida = 50000;

    ret.sincronizandoReportes = false;

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
        //TODO: HACER.
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
        MAIN.sincronizandoReportes = false;
    }

    if(typeof(Worker) !== "undefined") {
        if (typeof(w) == "undefined") {
            w = new Worker("js/controladores/sinc_reportes_worker.js");
        }
        w.onmessage = function(event) {
            if (MAIN.sincronizandoReportes) {
                console.log('No ejecutamos sincronización reportes en MAIN porque ya se estaban sincronizando reportes.');
            } else {
                MAIN.sincronizandoReportes = true;
                console.log('Ejecutando sincronización reportes MAIN.');
                MAIN.controladores.sincronizadorReportes.enviarReportesPendientes(
                    procesoSincOk,
                    procesoSincKo
                );
            }
        };
    }

    return ret;
}());