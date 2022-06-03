MAIN.controladores.sincronizadorReportes = (function() {
	var ret = {};

    var enviandoReportes = false;
    var ws = MAIN.ws;
    var deferredUtils = MAIN.utils.deferredUtils;

    ret.enviarReportesPendientes = function(onSuccess, onError){	
		console.debug("Iniciando envío de reportes pendientes.");
		enviandoReportes = true;
		
		var successCallback = function(){
			enviandoReportes = false;
			console.debug("Envío de reportes pendientes finalizado correctamente.");
			if(onSuccess){
				onSuccess();
			}
		};
		
		var errorCallback = function(){
			enviandoReportes = false;
			console.error("El envío de reportes pendientes finalizo con errores.");
			if(onError){
				onError();
			}
		};
		
		if(!MAIN.utils.connectivityManager.isOnline()){
            console.error("El envío de reportes pendientes se pospone por falta de conectividad.");
            errorCallback();
            return;
        }
        
        var arrayReportes = [];
        var misReportesCoberturaString = localStorage.getItem(MAIN.keyLSDatosCoberturaPendientesSubida);
        if (misReportesCoberturaString && (misReportesCoberturaString !== "")) {
            arrayReportes = JSON.parse(misReportesCoberturaString);
        }
        
        if(arrayReportes.length === 0){
            console.debug("No hay reportes pendientes de enviar.");
            successCallback();
            return;
        }
        
        var arrayPromisesEnvios = [];
        var arrayReportesAEliminar = [];
        var callback = null;
        for(var i = 0; i < arrayReportes.length; i++){
            arrayPromisesEnvios.push(promiseEnvioEjecutado(arrayReportes[i], arrayReportesAEliminar));
        }
        
        deferredUtils.whenNonLazy(arrayPromisesEnvios)
        .then(
            function(){
                callback = successCallback;
                //Ahora eliminamos los que haya en el array de reportes a eliminar.
                console.log("Eliminando " + arrayReportesAEliminar.length + " reportes");					
                return borrarReportes(arrayReportesAEliminar);
            },
            function(){
                callback = errorCallback;
                //Ahora eliminamos los que haya en el array de reportes a eliminar.
                console.log("Eliminando " + arrayReportesAEliminar.length + " reportes");
                return borrarReportes(arrayReportesAEliminar);
            }
        )
        .always(function(){
            callback();
        });
	};

    /*
    datosConexionLimpiados: false
    ine: "44007"
    latencia: 55
    modelo: "PC"
    municipio: "Alba"
    operador: "Desconocido"
    rangoIntensidadSenial: "-1"
    so: "Windows"
    timestamp: "2022-04-21 08:10:02Z"
    tipoRed: "Desconocido"
    ubicacionManual: true
    valorIntensidadSenial: ""
    velocidadBajada: 97.83784679669408
    velocidadSubida: null
    */
    function promiseEnvioEjecutado(reporte, arrayReportesAEliminar){
        if (!reporte.coordenadax) {
            reporte.coordenadax = null;
        }
        if (!reporte.coordenaday) {
            reporte.coordenaday = null;
        }
        if (!reporte.coordenadax5000) {
            reporte.coordenadax5000 = null;
        }
        if (!reporte.coordenaday5000) {
            reporte.coordenaday5000 = null;
        }
        if (!reporte.coordenadax20000) {
            reporte.coordenadax20000 = null;
        }
        if (!reporte.coordenaday20000) {
            reporte.coordenaday20000 = null;
        }
        //Antes de enviar los resultados paso la velocidadBajada, velocidadSubida y ping a string:
        if (reporte.velocidadBajada) {
            reporte.velocidadBajada = reporte.velocidadBajada.toString();
        } else {
            reporte.velocidadBajada = "0.1";
        }
        if (reporte.velocidadSubida) {
            reporte.velocidadSubida = reporte.velocidadSubida.toString();
        } else {
            reporte.velocidadSubida = "0.1";
        }
        if (reporte.latencia) {
            reporte.latencia = reporte.latencia.toString();
        } else {
            reporte.latencia = "";
        }
        if (reporte.valorIntensidadSenial) {
            reporte.valorIntensidadSenial = reporte.valorIntensidadSenial.toString();
        }
        
        return ws.registrarDatosCobertura(reporte).
		done(
			function(){
				console.log("Reporte " + reporte.timestamp +" enviado. Preparando para eliminar...");
				arrayReportesAEliminar.push(reporte.timestamp);
			}
		);
	}

    function borrarReportes(arrayReportesAEliminar) {
        if(arrayReportesAEliminar.length === 0){
            return $.Deferred().resolve().promise();
        }

        var def = $.Deferred();

        var misReportesCoberturaString = localStorage.getItem(MAIN.keyLSDatosCoberturaPendientesSubida);
        if (misReportesCoberturaString && (misReportesCoberturaString !== "")) {
            var arrayReportesAlmacenados = JSON.parse(misReportesCoberturaString);
            var arrayReportesNuevosAlmacenar = [];
            for(var i = 0; i < arrayReportesAlmacenados.length; i++) {
                if (arrayReportesAEliminar.indexOf(arrayReportesAlmacenados[i].timestamp) < 0) {
                    arrayReportesNuevosAlmacenar.push(arrayReportesAlmacenados[i]);
                }
            }
            localStorage.setItem(MAIN.keyLSDatosCoberturaPendientesSubida, JSON.stringify(arrayReportesNuevosAlmacenar));
            def.resolve();
        } else {
            def.resolve();
        }

        return def.promise();
    }

    return ret;

}());