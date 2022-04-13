(function () {

    var misDatosCobertura;
    var ws = MAIN.ws;

    $(document).ready(function () {
        console.log('Página resumenDatos lista.');
        var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
        misDatosCobertura = JSON.parse(misDatosCoberturaString);

        console.log('Mis datos de cobertura: ' + misDatosCoberturaString);
        if (misDatosCobertura.velocidadBajada) {
            var velocidadBajadaNumero = Number(misDatosCobertura.velocidadBajada);
            $("#id_valor_resumen_velocidad_descarga").text(velocidadBajadaNumero.toFixed(2) + " Mbps");
            if ((misDatosCobertura.tipoRed === "Desconocido") && (MAIN.utils.platformDetector.isMobile()) && (velocidadBajadaNumero > 90)) {
                misDatosCobertura.tipoRed = "5G";
            }
        } else {
            $("#id_valor_resumen_velocidad_descarga").text("Desconocido");
        }
        if (misDatosCobertura.velocidadSubida) {
            var velocidadSubidaNumero = Number(misDatosCobertura.velocidadSubida);
            $("#id_valor_resumen_velocidad_subida").text(velocidadSubidaNumero.toFixed(2) + " Mbps");
        } else {
            $("#id_valor_resumen_velocidad_subida").text("Desconocido");
        }
        if (misDatosCobertura.latencia) {
            $("#id_valor_resumen_ping").text(misDatosCobertura.latencia + " ms");
        } else {
            $("#id_valor_resumen_ping").text("Desconocido");
        }

        var textoMunicipio = misDatosCobertura.municipio;
        var miINE = misDatosCobertura.ine;
        if (miINE && (miINE !== "")) {
            if (miINE.length > 0) {
                var codProvinciaAux = miINE.substring(0, 2);
                if (codProvinciaAux === "50") {
                    textoMunicipio = textoMunicipio + " (Zaragoza)";
                } else if (codProvinciaAux === "22") {
                    textoMunicipio = textoMunicipio + " (Huesca)";
                } else if (codProvinciaAux === "44") {
                    textoMunicipio = textoMunicipio + " (Teruel)";
                }
            }
        }
        $("#id_valor_resumen_ubicacion").text(textoMunicipio);
        $("#id_valor_resumen_modelo_so").text(misDatosCobertura.modelo + " - " + misDatosCobertura.so);
        $("#id_valor_resumen_tipo_red").text(misDatosCobertura.tipoRed);
        $("#id_valor_resumen_operador").text(misDatosCobertura.operador);
        if (misDatosCobertura.rangoIntensidadSenial === "0") {
            $("#id_valor_resumen_intensidad_senial").text("Sin señal");
        } else if (misDatosCobertura.rangoIntensidadSenial === "-1") {
            $("#id_valor_resumen_intensidad_senial").text("Desconocido");
        } else {
            $("#id_valor_resumen_intensidad_senial").text(misDatosCobertura.valorIntensidadSenial);
        }

        //Botón revisar datos
        $("#id_bot_resumen_revisar_datos").on(MAIN.clickEvent, function (){
            console.log('Boton revisar datos pulsado.');
            document.location="infoConexion.html";
        });

        //Botón enviar resultados
        $("#id_bot_resumen_enviar_resultados").on(MAIN.clickEvent, function (){
            console.log('Boton enviar resultados pulsado.');
            if (!misDatosCobertura.coordenadax) {
                misDatosCobertura.coordenadax = null;
            }
            if (!misDatosCobertura.coordenaday) {
                misDatosCobertura.coordenaday = null;
            }
            //Antes de enviar los resultados paso la velocidadBajada, velocidadSubida y ping a string:
            if (misDatosCobertura.velocidadBajada) {
                misDatosCobertura.velocidadBajada = misDatosCobertura.velocidadBajada.toString();
            }
            if (misDatosCobertura.velocidadSubida) {
                misDatosCobertura.velocidadSubida = misDatosCobertura.velocidadSubida.toString();
            }
            if (misDatosCobertura.latencia) {
                misDatosCobertura.latencia = misDatosCobertura.latencia.toString();
            }
            $.when( ws.registrarDatosCobertura(misDatosCobertura) )
            .then(function (wsResponse) {     
                //alert("login done: " + wsResponse);
                if (wsResponse.getResponseType() == ws.OK) {
                    console.log('Datos de cobertura registrados correctamente');
                    document.location="datosEnviadosOK.html";
                }
                else if(wsResponse.getResponseType() == ws.ERROR_CONTROLADO){
                    console.log('Ha fallado el WS de registrarDatosCobertura.');
                    document.location="datosEnviadosKO.html";
                }
                else{
                    console.log('Ha fallado el WS de registrarDatosCobertura. Error desconocido.');
                    document.location="datosEnviadosKO.html";
                }
            })
            .fail(function (wsError){
                console.log("registrarDatosCobertura Error: " + wsError);
                
                if(wsError.getResponseMessage() == "timeout"){
                    console.log('Ha fallado el WS de registrarDatosCobertura. Timeout.');
                    document.location="datosEnviadosKO.html";
                }
                else{
                    console.log('Ha fallado el WS de registrarDatosCobertura. Fail.');
                    document.location="datosEnviadosKO.html";
                }

            });
        });

        //Botón atrás
        $("#id_bot_atras_resumen_datos").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
    });

    function volverAtras() {
        if(MAIN.utils.connectivityManager.isOnline()) {
            console.log("Sí hay cobertura. Vuelvo a la pantalla de infoTestVelocidad.");
            document.location="infoTestVelocidad.html";
        } else {
            console.log("No hay cobertura. Vuelvo a la pantalla de infoConexion.");
            document.location="infoConexion.html";
        }
    }

}());