 document.addEventListener("deviceready", onDeviceReady, false);
 
 

    var miTimestamp;
    var miLatitud;
    var miLongitud;
    var miCoordenadaX;
    var miCoordenadaY;
    var miCoordenadaX5000;
    var miCoordenadaY5000;
    var miCoordenadaX20000;
    var miCoordenadaY20000;
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
    var miCobertura = null;
    var miCategoriaRed = null;
    var ws = MAIN.ws;
    var ubicacionObtenida = false;
    var ubicacionCapturadaManualmente = false;
    var localizacionDetenidaPorTimeout = false;
    var localizacionCompletada = false;
    var IR_A_NINGUN_SITIO = "IrNingunSitio";
    var IR_A_TEST_VELOCIDAD = "IrTestVelocidad";
    var IR_A_RESUMEN_DATOS = "IrResumenDatos";
    var dondeIrGlobal = "";

    function onDeviceReady() {
    	$("#mainPage").css("visibility","visible");
        console.log('Página infoConexion lista.');
        localizacionDetenidaPorTimeout = false;
        localizacionCompletada = false;

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

        //Bloqueamos el botón físico de atrás para que no se haga un history.back.
        document.addEventListener("backbutton", function (e) {
            console.log('Boton físico de atrás pulsado.');
            e.preventDefault();
        }, false );

       // document.addEventListener("online", onOnline, false);

        //No se puede editar ninguna de las opciones y todas se cumplimentarán automáticamente (salvo la Ubicación en caso de que no se pueda obtener):
        $('#inputModeloSO').prop('disabled', true);
        $('#inputTipoRed').prop('disabled', true);
        $('#inputCalidad').prop('disabled', true);
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
                miVelocidadBajada = misDatosCoberturaAux.velocidadBajada;
                miVelocidadSubida = misDatosCoberturaAux.velocidadSubida;
                miLatencia = misDatosCoberturaAux.latencia;
                $('#id_bot_resultados_info_conexion').show();
                $('#submitForm').text("Repetir test de velocidad");
            } else {
                $('#id_bot_resultados_info_conexion').hide();
            $('#submitForm').text("Iniciar test de velocidad");
            }
            

            //Vamos a intentar detectar el tipo de conexión con navigator.connection.type
            onOnline();

            miOperador = "Desconocido";
            $("#inputOperador").val("Desconocido");
            if ((!miOperador) || (miOperador === "Desconocido")) {
                $('#divInputOperador').hide();
            } else {
                $('#divInputOperador').show();
            }
        }

        $("#submitForm").on(MAIN.clickEvent, function (event){
            console.log('Botón submitForm pulsado.');
            if (ubicacionObtenida) {
                //Modificado 23/05/2022: Antes de salir de la pantalla, si la ubicación capturada es manual, intento volver a obtener la ubicación real.
                //Modificado 01/06/2022: Ya no se hace esta comprobación:
                /*
                if (ubicacionCapturadaManualmente) {
                    getLocation(IR_A_TEST_VELOCIDAD);
                } else {
                    irATestVelocidad();
                }
                */
                irATestVelocidad();
            } else {
                console.log('Ubicación no obtenida.');
                event.preventDefault();
                $("body").overhang({
                    type: "error",
                    message: "Por favor, debe especificar su ubicación antes de continuar.",
                    closeConfirm: true
                });
            }
        });

        //Input ubicación.
        $("#labelValorUbicacion").on(MAIN.clickEvent, function (){
            console.log('Label ubicación pulsado.');
            //Si está disabled no dejo entrar a la pantalla de ubicación manual.
            if ($("#labelValorUbicacion").prop("disabled")) {
                console.log('Label ubicación disabled. No dejo entrar a ubicación manual.');
            } else {
                console.log('Label ubicación enabled. Sí dejo entrar a ubicación manual.');
                miOperador = $("#inputOperador").val();
                var misDatosCoberturaUbicacionManual = new DatosCobertura(miTimestamp, miCoordenadaX, miCoordenadaY, miCoordenadaX5000, miCoordenadaY5000, miCoordenadaX20000, miCoordenadaY20000, miMunicipio, miINE, miModelo, miSO, miTipoRed,miCategoriaRed, miOperador, miValorIntensidad, miRangoIntensidad, miVelocidadBajada, miVelocidadSubida, miLatencia, false, ubicacionCapturadaManualmente);
                localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(misDatosCoberturaUbicacionManual));
                document.location="ubicacionManual.html";
            }
        });

        //Botón resultados
        $("#id_bot_resultados_info_conexion").on(MAIN.clickEvent, function (event){
            console.log('Boton resultados pulsado.');
            if (ubicacionObtenida) {
                //Modificado 23/05/2022: Antes de salir de la pantalla, si la ubicación capturada es manual, intento volver a obtener la ubicación real.
                //Modificado 01/06/2022: Ya no se hace esta comprobación.
                /*
                if (ubicacionCapturadaManualmente) {
                    getLocation(IR_A_RESUMEN_DATOS);
                } else {
                    irAResumenDatos();
                }
                */
                irAResumenDatos();
            } else {
                event.preventDefault();
                $("body").overhang({
                    type: "error",
                    message: "Por favor, debe especificar su ubicación antes de continuar.",
                    closeConfirm: true
                });
            }
        });

        //Botón atrás
        $("#id_bot_atras_info_conexion").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
        document.addEventListener("backbutton", volverAtras, false);
    }

    function irATestVelocidad() {
        miOperador = $("#inputOperador").val();

        console.log("He hecho submit: " + miModelo + " - " + miTipoRed + " - " + miOperador + " - " + miValorIntensidad);

        miTimestamp = MAIN.utils.stringUtils.dateToString_yyyyMMddhhmm_UTC(new Date());

        var misDatosCoberturaBotTestVel = new DatosCobertura(miTimestamp, miCoordenadaX, miCoordenadaY, miCoordenadaX5000, miCoordenadaY5000, miCoordenadaX20000, miCoordenadaY20000, miMunicipio, miINE, miModelo, miSO, miTipoRed, miCategoriaRed, miOperador, miValorIntensidad, miRangoIntensidad, miVelocidadBajada, miVelocidadSubida, miLatencia, false, ubicacionCapturadaManualmente);

        localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(misDatosCoberturaBotTestVel));
        document.location="infoTestVelocidad.html";
    }

    function irAResumenDatos() {
        //Actualizo los datos por si he camnbiado algo manualmente:
        var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
        if (misDatosCoberturaString && (misDatosCoberturaString !== "")) {
            var datosCoberturaAux = JSON.parse(misDatosCoberturaString);
            miTimestamp = MAIN.utils.stringUtils.dateToString_yyyyMMddhhmm_UTC(new Date()); //Actualizo la fecha de captura de datos.
            datosCoberturaAux.timestamp = miTimestamp;
            datosCoberturaAux.coordenadax = miCoordenadaX;
            datosCoberturaAux.coordenaday = miCoordenadaY;
            datosCoberturaAux.coordenadax5000 = miCoordenadaX5000;
            datosCoberturaAux.coordenaday5000 = miCoordenadaY5000;
            datosCoberturaAux.coordenadax20000 = miCoordenadaX20000;
            datosCoberturaAux.coordenaday20000 = miCoordenadaY20000;
            datosCoberturaAux.municipio = miMunicipio;
            datosCoberturaAux.ine = miINE;
            datosCoberturaAux.modelo = miModelo;
            datosCoberturaAux.cobertura = miCobertura;
            datosCoberturaAux.categoriaRed = miCategoriaRed;
            datosCoberturaAux.so = miSO;
            datosCoberturaAux.tipoRed = miTipoRed;
            miOperador = $("#inputOperador").val();
            datosCoberturaAux.operador = miOperador;
            datosCoberturaAux.valorIntensidadSenial = miValorIntensidad;
            datosCoberturaAux.rangoIntensidadSenial = miRangoIntensidad;
            datosCoberturaAux.ubicacionManual = ubicacionCapturadaManualmente;
            localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(datosCoberturaAux));
        }
        document.location="resumenDatos.html";
    }

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

    function onOnline() {
        // Handle the online event
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
        
        var networkState = "Desconocido";
        if (navigator.connection && navigator.connection.type) {
            networkState = navigator.connection.type;
          /*  setTimeout(function(){
                networkState = navigator.connection.type;*/
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
                    $("#inputIntensidad").val("Desconocido");
                    miValorIntensidad = "";
                    miRangoIntensidad = "-1";
                    $('#divInputIntensidad').hide();
                } else {
                    $('#divInputTipoRed').show();

                    //Una vez que sepamos el tipo de conexión coger la intensidad de la señal con el plugin.
                    // Así sabemos si tenemos que coger la intensidad del movil o del wifi.
                    if ((plataforma === MAIN.utils.platformDetector.ANDROID) && (window.SignalStrength)) {
                       /* if (miTipoRed.toUpperCase() === "WIFI") {
                            window.SignalStrength.wifidbm(
                                function(measuredDbm){
                                    console.log('current wifi dBm is: ' + measuredDbm);
                                    if (measuredDbm == -1) {
                                        $("#inputIntensidad").val("Desconocido");
                                        miValorIntensidad = "";
                                        miRangoIntensidad = "-1";
                                        $('#divInputIntensidad').hide();
                                    } else {
                                        //Si los dbm nos vienen en positivo los paso a negativos.
                                        if (measuredDbm > 0) {
                                            miValorIntensidad = measuredDbm * (-1);
                                        } else {
                                            miValorIntensidad = measuredDbm;
                                        }
                                        miRangoIntensidad = "";
                                        $("#inputIntensidad").val(miValorIntensidad);
                                        $('#divInputIntensidad').show();
                                    }
                                }
                            )
                        } else {*/
                            window.SignalStrength.dbm(
                                function(measuredDbm){
                                    console.log('current mobile dBm is: ' + measuredDbm);
                                    if (measuredDbm == -1) {
                                        medirIntensidadSenialConDelaiy();
                                    } else {
                                        //Si los dbm nos vienen en positivo los paso a negativos.
                                        if (measuredDbm > 0) {
                                            miValorIntensidad = measuredDbm * (-1);
                                        } else {
                                            miValorIntensidad = measuredDbm;
                                        }
                                        miRangoIntensidad = "";
                                        $("#inputIntensidad").val(miValorIntensidad);
                                        $('#divInputIntensidad').show();
                                    }
                                }
                            )
                       // }
                    } else {
                        $("#inputIntensidad").val("Desconocido");
                        miValorIntensidad = "";
                        miRangoIntensidad = "-1";
                        $('#divInputIntensidad').hide();
                    }
                }
            /*}, 1000)*/;
        } else {
            miTipoRed = networkState;
            $("#inputTipoRed").val(miTipoRed);
            $("#inputIntensidad").val("Desconocido");
            miValorIntensidad = "";
            miRangoIntensidad = "-1";

            $('#divInputTipoRed').hide();
            $('#divInputIntensidad').hide();
        }
        getLocation(IR_A_NINGUN_SITIO);

    }

    function contarTimeoutLocalizacion() {
        setTimeout(function(){
            console.log('Se acabó el timeout para localizar el dispositivo.');
            if (!localizacionCompletada) {
                localizacionDetenidaPorTimeout = true;
                $.mobile.loading( "hide" );

                if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                    irAResumenDatos();
                } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                    irATestVelocidad();
                }
            }

        }, MAIN.timeoutLocalizacion);
    }

    function getLocation(dondeIr) {
        dondeIrGlobal = dondeIr;
        localizacionDetenidaPorTimeout = false;
        localizacionCompletada = false;
        contarTimeoutLocalizacion();
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
            ubicacionObtenida = false;
            localizacionCompletada = true;
            MAIN.setSincronizandoReportesFalse();
            if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                irAResumenDatos();
            } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                irATestVelocidad();
            }
        }
    }
    function showPosition(position) {
        if (!localizacionDetenidaPorTimeout) {
            miLatitud = position.coords.latitude;
            miLongitud = position.coords.longitude;

            console.log("Posición obtenida: Latitud: " + miLatitud + " Longitud: " + miLongitud);

            if (MAIN.localizacionParaDebug) {
                miLatitud = 42.09441;
                miLongitud = -0.35527;
            }

            $.when( ws.obtenerDatosPorCoordenadas(miLatitud, miLongitud, miSO, miModelo, miTipoRed) )
            .then(function (wsResponse) {     
                //alert("login done: " + wsResponse);
                localizacionCompletada = true;
                MAIN.setSincronizandoReportesFalse();
                if (wsResponse.getResponseType() == ws.OK) {
                    $.mobile.loading( "hide" );

                    var resp = wsResponse.getContent();

                    miMunicipio = resp.nombreMunicipio;
                    miINE = resp.ineMunicipio;
                    miProvincia = resp.provincia;
                    miCoordenadaX = resp.coordenadax;
                    miCoordenadaY = resp.coordenaday;
                    miCoordenadaX5000 = resp.coordenadax5000;
                    miCoordenadaY5000 = resp.coordenaday5000;
                    miCoordenadaX20000 = resp.coordenadax20000;
                    miCoordenadaY20000 = resp.coordenaday20000;
                    miCobertura=resp.cobertura;
                    miCategoriaRed=resp.categoriaRed;
                    //Si no se han recibido bien todos los campos del servicio web no pinto la posición como correcta.
                    if (miMunicipio && (miMunicipio !== "") && miINE && (miINE !== "") && miProvincia && (miProvincia !== "") && miCoordenadaX && (miCoordenadaX !== "") && miCoordenadaY && (miCoordenadaY !== "")) {
                        console.log('Municipio en el que estoy: ' + miMunicipio);

                        //pintarMapa();

                        //Actualizo el label de ubicación.
                        $("#labelValorUbicacion").val(miMunicipio + " (" + miProvincia + ")");
                        $('#labelValorUbicacion').prop('disabled', true);
                        ubicacionObtenida = true;
                        ubicacionCapturadaManualmente = false;

                        if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                            irAResumenDatos();
                        } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                            irATestVelocidad();
                        } else if (dondeIrGlobal === IR_A_NINGUN_SITIO) {
                            pintarMapa();
                        }
                    } else {
                        $("#labelValorUbicacion").val("- Desconocida -");
                        $('#labelValorUbicacion').prop('disabled', false);
                        ubicacionObtenida = false;

                        if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                            irAResumenDatos();
                        } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                            irATestVelocidad();
                        }
                    }
                }
                else if(wsResponse.getResponseType() == ws.ERROR_CONTROLADO){
                    $.mobile.loading( "hide" );
                    console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas.');
                    ubicacionObtenida = false;
                    if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                        irAResumenDatos();
                    } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                        irATestVelocidad();
                    }
                }
                else{
                    $.mobile.loading( "hide" );
                    console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Error desconocido.');
                    ubicacionObtenida = false;
                    if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                        irAResumenDatos();
                    } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                        irATestVelocidad();
                    }
                }
                
                if (miCategoriaRed){
            		if (miTipoRed && (miTipoRed!='Desconocido')){
            			$("#inputTipoRed").val(miTipoRed+" ("+miCategoriaRed+")");
            		}
            		else{
            			$("#inputTipoRed").val(miCategoriaRed);
            		}
            		$('#divInputTipoRed').show();
            		
            		
            	}
                if (miCobertura) {
                	$("#inputCalidad").text(miCobertura);
                	if (miCobertura.startsWith(1)){
                		$('#cajaCalidad').addClass("naranja");
                	}
                	else if (miCobertura.startsWith(2)){
                		$('#cajaCalidad').addClass("amarillo");
                	}
                	else if (miCobertura.startsWith(3)){
                		$('#cajaCalidad').addClass("verde");
                	}
                	else if (miCobertura.startsWith(4)){
                		$('#cajaCalidad').addClass("verde-oscuro");
                	}
                	$('#divInputCalidad').show();
                } else {
                    $('#divInputCalidad').hide();
                }
                
            })
            .fail(function (wsError){
                localizacionCompletada = true;
                $.mobile.loading( "hide" );
                MAIN.setSincronizandoReportesFalse();
                console.log("obtenerMunicipioPorCoordenadas Error: " + wsError);
                ubicacionObtenida = false;
                if(wsError.getResponseMessage() == "timeout"){
                    console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Timeout.');
                }
                else{
                    console.log('Ha fallado el WS de obtenerMunicipioPorCoordenadas. Fail.');
                }

                if (dondeIrGlobal === IR_A_RESUMEN_DATOS) {
                    irAResumenDatos();
                } else if (dondeIrGlobal === IR_A_TEST_VELOCIDAD) {
                    irATestVelocidad();
                }

            });
        }
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
            view: new ol.View(options),
            controls: [],
            interactions: []
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
        
       var layerCobertura =new ol.layer.Tile({
            source: new ol.source.TileWMS({
            params: {'LAYERS': (miCategoriaRed=='RED MOVIL'?'calidad_cobertura_red_movil':'calidad_cobertura_red_fija'),'VERSION':'1.1.1'},
            url: MAIN.urlGeoserver,
            projection: map_projection
            })
        });        
        mapOL.addLayer(layerCobertura);
        
        //Empiezo con el foco donde estoy.
        //var bbox_miposicion = [571580, 4412223, 812351, 4756639]; //Aragón entera
        //var bbox_miposicion = [763500, 4681500, 764000, 4682000]; //Abizanda
        var miNumeroCoordenadaX = MAIN.utils.stringUtils.parseInteger(miCoordenadaX);
        var miNumeroCoordenadaY = MAIN.utils.stringUtils.parseInteger(miCoordenadaY);
        var bbox_miposicion = [miNumeroCoordenadaX - 250, miNumeroCoordenadaY - 250, miNumeroCoordenadaX + 250, miNumeroCoordenadaY + 250];

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
                        $('#divInputIntensidad').hide();
                    } else {
                        //Si los dbm nos vienen en positivo los paso a negativos.
                        if (measuredDbm > 0) {
                            miValorIntensidad = measuredDbm * (-1);
                        } else {
                            miValorIntensidad = measuredDbm;
                        }
                        miRangoIntensidad = "";
                        $("#inputIntensidad").val(miValorIntensidad);
                        $('#divInputIntensidad').show();
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
        miCoordenadaX5000 = datosCoberturaObjeto.coordenadax5000;
        miCoordenadaY5000 = datosCoberturaObjeto.coordenaday5000;
        miCoordenadaX20000 = datosCoberturaObjeto.coordenadax20000;
        miCoordenadaY20000 = datosCoberturaObjeto.coordenaday20000;
        miMunicipio = datosCoberturaObjeto.municipio;
        miINE = datosCoberturaObjeto.ine;
        miModelo = datosCoberturaObjeto.modelo;
        miSO = datosCoberturaObjeto.so;
        miTipoRed = datosCoberturaObjeto.tipoRed;
        miCobertura = datosCoberturaObjeto.cobertura;
        miCategoriaRed = datosCoberturaObjeto.categoriaRed;
        miOperador = datosCoberturaObjeto.operador;
        miValorIntensidad = datosCoberturaObjeto.valorIntensidadSenial;
        miRangoIntensidad = datosCoberturaObjeto.rangoIntensidadSenial;
        miVelocidadBajada = datosCoberturaObjeto.velocidadBajada;
        miVelocidadSubida = datosCoberturaObjeto.velocidadSubida;
        miLatencia = datosCoberturaObjeto.latencia;
        ubicacionCapturadaManualmente = datosCoberturaObjeto.ubicacionManual;

        pintarMapa();
        
        //Actualizo el label de ubicación si tengo ubicación.
        if (miINE && (miINE !== "") && miMunicipio && (miMunicipio !== "")) {
        	var ineStr=miINE+"";
            if (ineStr.length > 0) {
                var codProvincia = ineStr.substring(0, 2);
                if (codProvincia === "50") {
                    miProvincia = "Zaragoza";
                } else if (codProvincia === "22") {
                    miProvincia = "Huesca";
                } else if (codProvincia === "44") {
                    miProvincia = "Teruel";
                }
            }
            $("#labelValorUbicacion").val(miMunicipio + " (" + miProvincia + ")");
            if (ubicacionCapturadaManualmente) {
                $('#labelValorUbicacion').prop('disabled', false);
            } else {
                $('#labelValorUbicacion').prop('disabled', true);
            }
            ubicacionObtenida = true;
        } else {
            $("#labelValorUbicacion").val("- Desconocida -");
            $('#labelValorUbicacion').prop('disabled', false);
            ubicacionObtenida = false;
        }
        

        $("#inputModeloSO").val(miModelo + " - " + miSO);
        if (((!miModelo) || (miModelo === "")) && ((!miSO) || (miSO === ""))) {
            $('#divInputModeloSO').hide();
        } else {
            $('#divInputModeloSO').show();
        }

        $("#inputTipoRed").val(miTipoRed);
        
        if (!miTipoRed && !miCategoriaRed) {
            $('#divInputTipoRed').hide();
        } else {
        	if (miCategoriaRed){
        		if (miTipoRed && (miTipoRed != "Desconocido")){
        			$("#inputTipoRed").val(miTipoRed+" ("+miCategoriaRed+")");
        		}
        		else{
        			$("#inputTipoRed").val(miCategoriaRed);
        		}
        	}
            $('#divInputTipoRed').show();
        }

        
        if (miCobertura) {
        	$("#inputCalidad").text(miCobertura);
        	if (miCobertura.startsWith(1)){
        		$('#cajaCalidad').addClass("naranja");
        	}
        	else if (miCobertura.startsWith(2)){
        		$('#cajaCalidad').addClass("amarillo");
        	}
        	else if (miCobertura.startsWith(3)){
        		$('#cajaCalidad').addClass("verde");
        	}
        	else if (miCobertura.startsWith(4)){
        		$('#cajaCalidad').addClass("verde-oscuro");
        	}
        	$('#divInputCalidad').show();
        } else {
            $('#divInputCalidad').hide();
        }
        $("#inputOperador").val(miOperador);
        if ((!miOperador) || (miOperador === "Desconocido")) {
            $('#divInputOperador').hide();
        } else {
            $('#divInputOperador').show();
        }

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

