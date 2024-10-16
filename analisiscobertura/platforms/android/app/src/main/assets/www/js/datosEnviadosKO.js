(function () {

    $(document).ready(function () {
    	$("#mainPage").css("visibility","visible");
        console.log('Página datos enviados KO lista.');

        //Bloqueamos el botón físico de atrás para que no se haga un history.back.
        document.addEventListener("backbutton", function (e) {
            console.log('Boton físico de atrás pulsado.');
            e.preventDefault();
        }, false );

        //Si en este momento se están enviando los reportes en segundo plano, en vez de aquí "guardaUltimoReporteCobertura",
        // activo una variable booleana en MAIN para que una vez que termine MAIN de sincronizar reportes, almaene el reporte actual en los pendiente de subida.
        if (MAIN.getSincronizandoReportes()) {
            console.log('En datosEnviadosKO no guardo el reporte actual porque se estaban sincronizando reportes.');
            var misDatosCoberturaStringAux = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
            if (misDatosCoberturaStringAux && (misDatosCoberturaStringAux !== "")) {
                localStorage.setItem(MAIN.keyLSDatosCoberturaPendientePersistir, misDatosCoberturaStringAux);
            }
        } else {
            //Almaceno el reporte actual en en el persisten storege de reportes pendientes de subida:
            var miArrayDatosCoberturaString = localStorage.getItem(MAIN.keyLSDatosCoberturaPendientesSubida);
            if (miArrayDatosCoberturaString && (miArrayDatosCoberturaString !== "")) {
                var arrayDatosCoberturaAux = JSON.parse(miArrayDatosCoberturaString);
                guardaUltimoReporteCobertura(arrayDatosCoberturaAux);
            } else {
                var arrayDatosCoberturaNuevo = new Array();
                guardaUltimoReporteCobertura(arrayDatosCoberturaNuevo);
            }
        }
        //Borro el reporte actual del localStorage par empezar el siguiente reporte desde cero.
        localStorage.removeItem(MAIN.keyLocalStorageDatosCobertura);

        //Botón finalizar
        $("#id_bot_finalizar_envio_ko").on(MAIN.clickEvent, function (){
            console.log('Boton finalizar pulsado.');
            document.location="index.html";
        });
    });

    function guardaUltimoReporteCobertura(arrayDatosCobertura) {
        var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
        if (misDatosCoberturaString && (misDatosCoberturaString !== "")) {
            var datosCoberturaAux = JSON.parse(misDatosCoberturaString);
            arrayDatosCobertura.unshift(datosCoberturaAux);
            localStorage.setItem(MAIN.keyLSDatosCoberturaPendientesSubida, JSON.stringify(arrayDatosCobertura));
        }
    }

}());