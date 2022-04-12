(function () {

    var miTimestamp;
    var miLatitud;
    var miLongitud;
    var miCoordenadaX;
    var miCoordenadaY;
    var miMunicipio;
    var miProvincia;
    var miINE;
    var miUTMX;
    var miUTMY;
    var miModelo;
    var miSO;
    var miTipoRed;
    var miOperador;
    var miValorIntensidad;
    var miRangoIntensidad;
    var miVelocidadBajada = null;
    var miVelocidadSubida = null;
    var miLatencia = null;
    var ws = MAIN.ws;

    $(document).ready(function () {
        console.log('Página infoConexion lista.');

        //Modificado 12/04/2022: Ahora el Operador ya no es un desplegable, ahora es un input.
        //Configuramos el desplegable de Operador:
        /*
        $("#inputOperador").mSelectDBox({
            "list": ["Vodafone", "Orange", "Movistar", "Más movil", "YOIGO", "O2", "Finetwork", "Jazztel", "Otro"],
            "multiple":false,
            "autoComplete":true,
            "name":"a",
            "embeddedInput":true,
            "zIndex": 9999,
            "width":"100vw",
            "closeButton":true,
            "exceptDisabled":true,
            "language":"en",
            "openOnFocus":true,
            "freeWrite":false
        });
        */

        //No se puede editar ninguna de las opciones y todas se cumplimentarán automáticamente (salvo la Ubicación en caso de que no se pueda obtener):
        $('#inputModeloSO').prop('disabled', true);
        $('#inputTipoRed').prop('disabled', true);
        $('#inputOperador').prop('disabled', true);
        $('#inputIntensidad').prop('disabled', true);

        //Si al entrar en esta pantalla ya tenía rellenos los datos de conexión los pinto y no los vuelvo a capturar.
        var misDatosConexionLimpiados = true;
        var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
        var misDatosCoberturaAux;
        if (misDatosCoberturaString && (misDatosCoberturaString !== "")) {
            misDatosCoberturaAux = JSON.parse(misDatosCoberturaString);
            if ((misDatosCoberturaAux) && (misDatosCoberturaAux.datosConexionLimpiados)) {
                misDatosConexionLimpiados = true;
            } else {
                misDatosConexionLimpiados = false;
            }
        }
        if (misDatosCoberturaString && (misDatosCoberturaString !== "") && (misDatosConexionLimpiados == false)) {
            cargarMisDatosCobertura(misDatosCoberturaString);
        } else {
            //Si ya había hecho el test de velocidad antes y lo único que quiero es volver a caturar los datos de conexión doy la opción de saltar directamente a resultados o repetir el test de velocidad.
            if ((misDatosCoberturaAux) && (testDeVelocidadHecho(misDatosCoberturaAux.velocidadBajada, misDatosCoberturaAux.velocidadSubida, misDatosCoberturaAux.latencia))) {
                $('#id_bot_resultados_info_conexion').show();
                $('#submitForm').text("Repetir test de velocidad");
            } else {
                $('#id_bot_resultados_info_conexion').hide();
            $('#submitForm').text("Iniciar test de velocidad");
            }
            getLocation();

            var plataforma = MAIN.utils.platformDetector.getPlatform();
            if (plataforma === MAIN.utils.platformDetector.ANDROID) {
                miModelo = MAIN.utils.platformDetector.getModel();
                miSO = "Android";
            } else if (plataforma === MAIN.utils.platformDetector.IOS) {
                miModelo = "iPhone";
                miSO = "iOS";
            } else if (plataforma === MAIN.utils.platformDetector.WINDOWS) {
                miModelo = "PC";
                miSO = "Windows";
            } else if (plataforma === MAIN.utils.platformDetector.OSX) {
                miModelo = "Mac";
                miSO = "OSX";
            } else if (plataforma === MAIN.utils.platformDetector.LINUX) {
                miModelo = "Linux";
                miSO = "Linux";
            } else {
                miModelo = "";
                miSO = "";
            }
            $("#inputModeloSO").val(miModelo + " - " + miSO);
            if (((!miModelo) || (miModelo === "")) && ((!miSO) || (miSO === ""))) {
                $('#divInputModeloSO').hide();
            } else {
                $('#divInputModeloSO').show();
            }

            //Vamos a intentar detectar el tipo de conexión con navigator.connection.type
            var networkState = navigator.connection.type;

            setTimeout(function(){
                networkState = navigator.connection.type;
                if (networkState === "unknown") {
                    networkState = "Desconocido";
                } else if (networkState === "cellular") {
                    networkState = "Móvil";
                } else if (networkState === "ethernet") {
                    networkState = "Cable";
                } else if (networkState === "none") {
                    networkState = "Sin conexión";
                }

                console.log('Connection type: ' + networkState);
                miTipoRed = networkState;
                $("#inputTipoRed").val(miTipoRed);
                if ((!networkState) || (networkState === "Desconocido")) {
                    $('#divInputTipoRed').hide();
                } else {
                    $('#divInputTipoRed').show();
                }
            }, 1000);
            
            //Coger la intensidad de la señal con el plugin.
            if (plataforma === MAIN.utils.platformDetector.ANDROID) {
                window.SignalStrength.dbm(
                    function(measuredDbm){
                        console.log('current dBm is: ' + measuredDbm);
                        if (measuredDbm == -1) {
                            medirIntensidadSenialConDelaiy();
                        } else {
                            miValorIntensidad = measuredDbm;
                            miRangoIntensidad = "";
                            $("#inputIntensidad").val(miValorIntensidad);
                            $('#divInputIntensidad').show();
                        }
                    }
                )
            } else {
                $("#inputIntensidad").val("Desconocido");
                miValorIntensidad = "";
                miRangoIntensidad = "-1";
                $('#divInputIntensidad').hide();
            }
        }

        $("#submitForm").on(MAIN.clickEvent, function (){
            //miModelo = $("#inputModeloSO").val();
            //miTipoRed = $("#inputTipoRed").val();
            miOperador = $("#inputOperador").val();
            //miValorIntensidad = $("#inputIntensidad").val();

            console.log("He hecho submit: " + miModelo + " - " + miTipoRed + " - " + miOperador + " - " + miValorIntensidad);

            miTimestamp = MAIN.utils.stringUtils.dateToString_yyyyMMddhhmm_UTC(new Date());

            var misDatosCobertura = new DatosCobertura(miTimestamp, miCoordenadaX, miCoordenadaY, miMunicipio, miINE, miModelo, miSO, miTipoRed, miOperador, miValorIntensidad, miRangoIntensidad, miVelocidadBajada, miVelocidadSubida, miLatencia, false);

            localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(misDatosCobertura));
            document.location="infoTestVelocidad.html";
            
            //event.preventDefault();
        });

        //Input ubicación. Si está disabled no funciona el evento click, por lo que si no está disabled que es cunado no tiene ubicación sí entraría.
        $("#labelValorUbicacion").on(MAIN.clickEvent, function (){
            console.log('Label ubicación pulsado.');
            /*
            if (!($("#labelValorUbicacion").prop("disabled"))) {
                document.location="ubicacionManual.html";
            }
            */
            miOperador = $("#inputOperador").val();
            var misDatosCobertura = new DatosCobertura(miTimestamp, miCoordenadaX, miCoordenadaY, miMunicipio, miINE, miModelo, miSO, miTipoRed, miOperador, miValorIntensidad, miRangoIntensidad, miVelocidadBajada, miVelocidadSubida, miLatencia, false);
            localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(misDatosCobertura));
            document.location="ubicacionManual.html";
        });

        //Botón resultados
        $("#id_bot_resultados_info_conexion").on(MAIN.clickEvent, function (){
            console.log('Boton resultados pulsado.');
            //Actualizo los datos por si he camnbiado algo manualmente:
            //Limpiamos mis datos conexión almacenados en el local storage salvo los datos del test de velocidad.
            var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
            if (misDatosCoberturaString && (misDatosCoberturaString !== "")) {
                var datosCoberturaAux = JSON.parse(misDatosCoberturaString);
                datosCoberturaAux.timestamp = miTimestamp;
                datosCoberturaAux.coordenadax = miCoordenadaX;
                datosCoberturaAux.coordenaday = miCoordenadaY;
                datosCoberturaAux.municipio = miMunicipio;
                datosCoberturaAux.ine = miINE;
                datosCoberturaAux.modelo = miModelo;
                datosCoberturaAux.so = miSO;
                datosCoberturaAux.tipoRed = miTipoRed;
                miOperador = $("#inputOperador").val();
                datosCoberturaAux.operador = miOperador;
                datosCoberturaAux.valorIntensidadSenial = miValorIntensidad;
                datosCoberturaAux.rangoIntensidadSenial = miRangoIntensidad;
                localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(datosCoberturaAux));
            }
            document.location="resumenDatos.html";
        });

        //Botón atrás
        $("#id_bot_atras_info_conexion").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
    });

    //Usar esto si la función getLocation no funciona en el móvil:
    /*
    function getLocationMovil() {
        if(navigator && navigator.geolocation) {
    		console.log("Geolocation soportado. " + navigator.geolocation.getCurrentPosition);
    		var confGPS = application.obtenerCalidadLocalizacionRequeridaParaUsuario();

    		//Modificado 17/11/2021: Antes de capturar la posición voy a quitarle a las opciones el campo "maximumAccuracy"
    		// por si está interfiriendo en las opciones ya que el plugin solo acepta las opciones "maximumAge", "timeout" y "enableHighAccuracy".
    		var confGPSAux = {
                    maximumAge: 0,
                    timeout: 0,
                    enableHighAccuracy: false
            };
            confGPSAux.maximumAge = confGPS.maximumAge;
            confGPSAux.timeout = confGPS.timeout;
            confGPSAux.enableHighAccuracy = confGPS.enableHighAccuracy;
    		
    		console.debug("*** Obteniendo posición por GPS?: " + confGPS.enableHighAccuracy);
    		//{maximumAge: 3000, timeout: 20000, enableHighAccuracy: localizacionPorGPS}
    		//Modificado 18/11/2021: Meto un retardo de 2 segundos porque si no hay GPS disponible
    		// y antes se había hecho una foto, lo que tarda en cerrar la preview de la cámara
    		// (si no meto el retardo) se pisa con la llamada al método navigator.geolocation.getCurrentPosition
    		// y eso hace que no salte el timeout al no poder capturar una posición GPS.
    		setTimeout(function () {
    		    navigator.geolocation.getCurrentPosition(
                        onLocationSuccess,
                        onLocationError,
                        confGPSAux
                );
            }, 2000);
		} else {
			onLocationError("Funcionalidad no disponible");
		}
    }
    function onLocationSuccess (position) {
    	console.debug("Posición GPS obtenida");
       
    	// console.log('Latitude: ' + position.coords.latitude + '\n' +
        // 'Longitude: ' + position.coords.longitude + '\n' +
        // 'Altitude: ' + position.coords.altitude + '\n' +
        // 'Accuracy: ' + position.coords.accuracy + '\n' +
        // 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        // 'Heading: ' + position.coords.heading + '\n' +
        // 'Speed: ' + position.coords.speed + '\n' +
        // 'Timestamp: ' + new Date(position.timestamp) + '\n');
       
    	if(position != null && position.coords != null && position.coords.accuracy != null) {
    		var confCalidadGPS = application.obtenerCalidadLocalizacionRequeridaParaUsuario();
    		if(position.coords.accuracy < confCalidadGPS.maximumAccuracy) {
    			var reporteAux = recuperarReporteAuxiliar();
    	        reporteAux.longitud = position.coords.longitude;
    	        reporteAux.latitud = position.coords.latitude;
    	        almacenarReporteAuxiliar(reporteAux);
    	        
    	        self.enviarInformes(reporteAux);
    		}
    		else {
    			onLocationError($.t("reportes.pos_gps_mala"));
    		}
    	}
        
    };
    // onError Callback receives a PositionError object
    function onLocationError(error) {
    	console.debug("Error al obtener GPS: " + error);
    	show_GPS_Position_Error(error);
    	self.hideProgress();
    	//popErrorDialog('Aviso', 'No se ha podido capturar la posici&#243;n. Mensaje: ' + error.message);
    	var reporteAux = recuperarReporteAuxiliar();
    	var arrayCamposAux = new Array();
    	arrayCamposAux[0] = reporteAux;
    	//popConfirmDialog("Aviso", txtAviso, self.enviarInformes, arrayCamposAux, self.hideProgress);
    	popConfirmDialog($.t("comunes.titulo_dlg_advert"), $.t("reportes.pregunta_sin_gps_reportar"), self.continuarEnvioReportePorGPSFallo, arrayCamposAux, self.cancelarEnvioReportePorGPSFallo);
    }
    */

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

                console.log('Municipio en el que estoy: ' + miMunicipio);

                pintarMapa();

                //Actualizo el label de ubicación.
                $("#labelValorUbicacion").val(miMunicipio + " (" + miProvincia + ")");
                $('#labelValorUbicacion').prop('disabled', true);
            }
            else if(wsResponse.getResponseType() == ws.ERROR_CONTROLADO){
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas.');
            }
            else{
            	console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Error desconocido.');
            }
		})
        .fail(function (wsError){
            console.log("obtenerMunicipioPorCoordenadas Error: " + wsError);
            if(wsError.getResponseMessage() == "timeout"){
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Timeout.');
            }
            else{
                console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Fail.');
            }

        });
    }

    function pintarMapa() {
        //MAPA
        var WMS_SRS = 'EPSG:25830';
        var map_projection = new ol.proj.Projection({            
            code:WMS_SRS,
            units: 'm'
        });
        var options = {
            projection : map_projection,
        };
        //attribution = getFondoLabel()+base_attribution;
        mapOL = new ol.Map({        
            target: 'map',
            view: new ol.View(options)
        }); 
    
        var layerAragonFoto =new ol.layer.Tile({
            source: new ol.source.TileWMS({
            params: {'LAYERS': 'modis,landsat,spot,2018_pnoa','VERSION':'1.1.1'},
            url: 'https://idearagon.aragon.es/AragonFotos?service=wms&request=GetCapabilities',
            projection: map_projection
            })
        });
        //Capas existentes: params: {'LAYERS': 'AraFon,LimPas,CapProv,CapCom,ComunidadAutonoma,Exonimos,Provincia,Comarca,Municipio,Localidad,RedCar,RedCarCod,Carretera,Ferrocarril,Hidro300k,Rio','VERSION':'1.1.1'},
        mapOL.addLayer(layerAragonFoto);
        var layerVisor2d =new ol.layer.Tile({
            source: new ol.source.TileWMS({
            params: {'LAYERS': 'CapProv,CapCom,ComunidadAutonoma,Provincia,Comarca,Municipio,Localidad,Hidro300k,Rio','VERSION':'1.1.1'},
            url: 'https://idearagon.aragon.es/Visor2D',
            projection: map_projection
            })
        });        
        mapOL.addLayer(layerVisor2d);
        
        //Empiezo con el foco donde estoy.
        //var bbox_miposicion = [571580, 4412223, 812351, 4756639]; //Aragón entera
        //var bbox_miposicion = [763500, 4681500, 764000, 4682000]; //Abizanda
        var miNumeroCoordenadaX = MAIN.utils.stringUtils.parseInteger(miCoordenadaX);
        var miNumeroCoordenadaY = MAIN.utils.stringUtils.parseInteger(miCoordenadaY);
        var bbox_miposicion = [miNumeroCoordenadaX, miNumeroCoordenadaY, miNumeroCoordenadaX + 500, miNumeroCoordenadaY + 500];

        mapOL.getView().fit(bbox_miposicion, mapOL.getSize());
        //FIN MAPA
    }

    function medirIntensidadSenialConDelaiy() {
        setTimeout(function(){
            window.SignalStrength.dbm(
                function(measuredDbm){
                    console.log('current dBm is: ' + measuredDbm);
                    if (measuredDbm == -1) {
                        $("#inputIntensidad").val("Desconocido");
                        miValorIntensidad = "";
                        miRangoIntensidad = "-1";
                    } else {
                        miValorIntensidad = measuredDbm;
                        miRangoIntensidad = "";
                        $("#inputIntensidad").val(miValorIntensidad);
                    }
                }
            )
        }, 2000);
    }

    function cargarMisDatosCobertura(datosCoberturaString) {
        console.log("Cargando mis datos de cobertura: " + datosCoberturaString);
        datosCoberturaObjeto = JSON.parse(datosCoberturaString);

        miTimestamp = datosCoberturaObjeto.timestamp;
        miCoordenadaX = datosCoberturaObjeto.coordenadax;
        miCoordenadaY = datosCoberturaObjeto.coordenaday;
        miMunicipio = datosCoberturaObjeto.municipio;
        miINE = datosCoberturaObjeto.ine;
        miModelo = datosCoberturaObjeto.modelo;
        miSO = datosCoberturaObjeto.so;
        miTipoRed = datosCoberturaObjeto.tipoRed;
        miOperador = datosCoberturaObjeto.operador;
        miValorIntensidad = datosCoberturaObjeto.valorIntensidadSenial;
        miRangoIntensidad = datosCoberturaObjeto.rangoIntensidadSenial;
        miVelocidadBajada = datosCoberturaObjeto.velocidadBajada;
        miVelocidadSubida = datosCoberturaObjeto.velocidadSubida;
        miLatencia = datosCoberturaObjeto.latencia;

        pintarMapa();

        //Actualizo el label de ubicación.
        if (miINE.length > 0) {
            var codProvincia = miINE.substring(0, 2);
            if (codProvincia === "50") {
                miProvincia = "Zaragoza";
            } else if (codProvincia === "22") {
                miProvincia = "Huesca";
            } else if (codProvincia === "44") {
                miProvincia = "Teruel";
            }
        }
        $("#labelValorUbicacion").val(miMunicipio + " (" + miProvincia + ")");
        $('#labelValorUbicacion').prop('disabled', true);

        $("#inputModeloSO").val(miModelo + " - " + miSO);
        if (((!miModelo) || (miModelo === "")) && ((!miSO) || (miSO === ""))) {
            $('#divInputModeloSO').hide();
        } else {
            $('#divInputModeloSO').show();
        }

        $("#inputTipoRed").val(miTipoRed);
        if ((!miTipoRed) || (miTipoRed === "Desconocido")) {
            $('#divInputTipoRed').hide();
        } else {
            $('#divInputTipoRed').show();
        }

        $("#inputOperador").val(miOperador);
        
        if (miRangoIntensidad.toString() === "-1") {
            $("#inputIntensidad").val("Desconocido");
            $('#divInputIntensidad').hide();
        } else {
            $("#inputIntensidad").val(miValorIntensidad);
            $('#divInputIntensidad').show();
        }

        //Miro si tengo datos del test de velocidad hechos. Si los tengo pongo "Repetir test" y muestro el botón de "Resultados".
        //if ((miLatencia && (miLatencia.toString() !== "")) || (miVelocidadBajada && (miVelocidadBajada.toString() !== "")) || (miVelocidadSubida && (miVelocidadSubida.toString() !== "")))
        if (testDeVelocidadHecho(miVelocidadBajada, miVelocidadSubida, miLatencia)) {
            $('#id_bot_resultados_info_conexion').show();
            $('#submitForm').text("Repetir test de velocidad");
        } else {
            $('#id_bot_resultados_info_conexion').hide();
            $('#submitForm').text("Iniciar test de velocidad");
        }
    }

    function volverAtras() {
        document.location="infoPrivacidad.html";
    }

    function testDeVelocidadHecho(velocidadBajadaComprobar, velocidadSubidaComprobar, latenciaComprobar) {
        if ((latenciaComprobar && (latenciaComprobar.toString() !== "")) || (velocidadBajadaComprobar && (velocidadBajadaComprobar.toString() !== "")) || (velocidadSubidaComprobar && (velocidadSubidaComprobar.toString() !== ""))) {
            return true;
        } else {
            return false;
        }
    }

}());