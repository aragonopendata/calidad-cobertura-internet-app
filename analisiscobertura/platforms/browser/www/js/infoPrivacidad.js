(function () {

    var ws = MAIN.ws;

    $(document).ready(function () {
        console.log('Página info privacidad lista.');
        
        //Botón más información
        $("#id_bot_mas_informacion_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton más información pulsado.');
            window.open("https://opendata.aragon.es/informacion/terminos-de-uso-licencias", "_blank");
        });

        //Botón aceptar
        $("#id_bot_acepto_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton acepto pulsado.');

            //Compruebo si tengo el modo avión activo. Si lo tengo activo ya no dejo segir diciendo al usuario que que lo quite.
            var plataforma = MAIN.utils.platformDetector.getPlatform();
            if (plataforma === MAIN.utils.platformDetector.ANDROID) {
                window.SignalStrength.checkAirPlaneModeOn(
                    function(estado){
                        console.log('Estado modo avión: ' + estado);
                        if (estado == 1) {
                            console.log('¡DESACTIVA MODO AVIÓN, POR FAVOR!');
                            $("body").overhang({
                                type: "error",
                                message: "Tiene activado el modo avión. Por favor, para usar esta aplicación desactivelo.",
                                closeConfirm: true
                            });
                        } else {
                            console.log('Voy a getLocation 1.');
                            getLocation();
                        }
                    }
                );
            } else {
                console.log('Voy a getLocation 2.');
                getLocation();
            }
        });

        //Botón atrás
        $("#id_bot_atras_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
    });

    function getLocation() {
        //Para que no se me cuele ninguna sincronización en segundo plano mientras determino la posición:
        MAIN.setSincronizandoReportesTrue();

        if (navigator.geolocation) {
            $.mobile.loading( "show", {
                text: "Recopilando datos ...",
                textVisible: true,
                theme: "b",
                textonly: true
            });
            navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
            console.log("Geolocation is not supported by this browser.");
            document.location="infoConexion.html";
        }
    }
    function showPosition(position) {
        miLatitud = position.coords.latitude;
        miLongitud = position.coords.longitude;

        console.log("Posición obtenida: Latitud: " + miLatitud + " Longitud: " + miLongitud);

        if (MAIN.entorno === "DEV") {
            miLatitud = 42.09441;
            miLongitud = -0.35527;
        }

        $.when( ws.obtenerMunicipioPorCoordenadas(miLatitud, miLongitud) )
		.then(function (wsResponse) {     
			//alert("login done: " + wsResponse);
            if (wsResponse.getResponseType() == ws.OK) {
                $.mobile.loading( "hide" );

				var resp = wsResponse.getContent();

                miMunicipio = resp.nombreMunicipio;
                miINE = resp.ineMunicipio;
                miProvincia = resp.provincia;
                miCoordenadaX = resp.coordenadax;
                miCoordenadaY = resp.coordenaday;

                console.log('Municipio de Aragón en el que estoy: ' + miMunicipio);
                //Como estoy en un municipio de Aragón sí dejo usar la aplicación.
                //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                document.location="infoConexion.html";
            }
            else if(wsResponse.getResponseType() == ws.ERROR_CONTROLADO){
                $.mobile.loading( "hide" );
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Error controlado.');
                if(wsResponse.getResponseMessage() == "No se encontraron conincidencias") {
                    //Como el servicio web de obtener municipio no encontró ningún municipio que esté en esa posición sé que el usuario no está en Aragón.
                    //$('#mensaje_error_fuera_de_aragon_info_privacidad').show();
                    MAIN.setSincronizandoReportesFalse();
                    $("body").overhang({
                        type: "error",
                        message: "Esta aplicación no puede ser utilizada fuera de la Comunidad de Aragón. Disculpe las molestias.",
                        closeConfirm: true
                    });
                } else {
                    //Ha fallado el servicio web. Dejo usar la aplicación porque no puedo demostrar que no esté en Aragón.
                    //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                    document.location="infoConexion.html";
                }
            }
            else{
                $.mobile.loading( "hide" );
            	console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Error desconocido.');
                //Ha fallado el servicio web. Dejo usar la aplicación porque no puedo demostrar que no esté en Aragón.
                //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                document.location="infoConexion.html";
            }
		})
        .fail(function (wsError){
            $.mobile.loading( "hide" );
            console.log("obtenerMunicipioPorCoordenadas Error: " + wsError);
            if(wsError.getResponseMessage() == "timeout"){
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Timeout.');
                //Ha fallado el servicio web. Dejo usar la aplicación porque no puedo demostrar que no esté en Aragón.
                //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                document.location="infoConexion.html";
            }
            else{
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Fail.');
                //Ha fallado el servicio web. Dejo usar la aplicación porque no puedo demostrar que no esté en Aragón.
                //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                document.location="infoConexion.html";
            }

        });
    }

    function volverAtras() {
        document.location="index.html";
    }

}());