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
            //Compruebo si estoy en Aragón. Si no estoy en Aragón no dejo seguiir al usuario.
            getLocation();
        });

        //Botón atrás
        $("#id_bot_atras_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
    });

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
            console.log("Geolocation is not supported by this browser.");
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
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Error controlado.');
                if(wsResponse.getResponseMessage() == "No se encontraron conincidencias") {
                    //Como el servicio web de obtener municipio no encontró ningún municipio que esté en esa posición sé que el usuario no está en Aragón.
                    //$('#mensaje_error_fuera_de_aragon_info_privacidad').show();
                    $("body").overhang({
                        type: "error",
                        message: "Esta aplicación no puede ser utilizada fuera de Aragón. Disculpe las molestias.",
                        closeConfirm: true
                    });
                } else {
                    //Ha fallado el servicio web. Dejo usar la aplicación porque no puedo demostrar que no esté en Aragón.
                    //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                    document.location="infoConexion.html";
                }
            }
            else{
            	console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Error desconocido.');
                //Ha fallado el servicio web. Dejo usar la aplicación porque no puedo demostrar que no esté en Aragón.
                //$('#mensaje_error_fuera_de_aragon_info_privacidad').hide();
                document.location="infoConexion.html";
            }
		})
        .fail(function (wsError){
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