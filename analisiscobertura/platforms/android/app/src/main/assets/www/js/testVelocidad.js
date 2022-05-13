(function() {
    //*** IMPORTS ***//
        
        var dialogUtils = MAIN.utils.dialogUtils;
        var platformDetector = MAIN.utils.platformDetector;
        //Modificación Test Velocidad 08/05/2014: Las URLs de bajada de ficheros, de subida y para la latencia las obtenemos del JSON del evento.
        var dao = MAIN.modelo.dao;
        var eventoCompleto = MAIN.modelo.eventoCompleto;
        
    //*** VARIABLES ***//
        
        //downloads vars
        // archivos a descargar (ordenados de menor a mayor)
        //Modificación Test Velocidad 08/05/2014: Las URLs de bajada de ficheros, de subida y para la latencia las obtenemos del JSON del evento.
        var testFiles = new Array();
        var errorTextMio = 'Error realizando el test de velocidad. Por favor inténtelo de nuevo.';
        var errorTextVelocidadDescarga = 'No se pudo obtener la velocidad de descarga.';
        var errorTextVelocidadSubida = 'No se pudo obtener la velocidad de subida.';
        var errorMostrado = "";
        
        var sizeBuffDescarga = 0;
        var timeBuffDescarga = 0;
        var velocidadMediaDescarga = 0;
        var gauge_download;
        var numberDownloadTest = 1;
        var miVelocidadDescargaResultado = 0;
        
        //Contra varios servidores
        var ARSIS = "Arsis"
        var ONEANDONE = "One&One";
        var actualServer = ARSIS;
        var errorArsis=0;
    
        //Modificación Test Velocidad 08/05/2014: Las URLs de bajada de ficheros, de subida y para la latencia las obtenemos del JSON del evento.
        var testFilesArsis = new Array();
        var testFilesOne = new Array();
        
        var resultadoActualArsis={
            tiempo:0,
            size:0,
            speed:0
        };
        
        //upload vars
        var uploadFile = new Array('file.txt');
        //Modificación Test Velocidad 08/05/2014: Las URLs de bajada de ficheros, de subida y para la latencia las obtenemos del JSON del evento.
        var uploadURL = '';
        var uploadURL2 = '';
        var uploadTime = 0;
        var numberUploadTest = 2;
        var uploadSize=12870630; //Bytes
        var gauge_upload;
        var sizeBuffSubida = 0;
        var timeBuffSubida = 0;
        var velocidadMediaSubida = 0;
        var miVelocidadSubidaResultado = 0;
        
        //Modificación Test Velocidad 08/05/2014: Incluir nuevas latencias para que cada prueba en cada servidor se haga con su latencia correspondiente.
        //latency vars
        var latencia=0;
        var startLatency=0;
        var endLatency=0;
        var latencia2=0;
        var startLatency2=0;
        var endLatency2=0;
        var latenciaUpload=0;
        var startLatencyUpload=0;
        var endLatencyUpload=0;
        var latenciaUpload2=0;
        var startLatencyUpload2=0;
        var endLatencyUpload2=0;
        var miMultiplicadorSubida = "1.5";
        var miLatenciaResultado = 0;
        
        var misDatosCobertura;
        var miTipoRed;

        var solicitadoDetenerTest = false;
        var testDetenidoPorTimeout = false;
    
    //*** INICIALIZACION ***//
        $(document).on("pageinit", '#id_test_velocidad', function() {
            console.log('Página testVelocidad lista.');

            //Bloqueamos el botón físico de atrás para que no se haga un history.back.
            document.addEventListener("backbutton", function (e) {
                console.log('Boton físico de atrás pulsado.');
                e.preventDefault();
            }, false );
            
            //Durante el test de velocidad no vamos a querer que se suba en ningún momento los reportes pendientes para no afectar a los resultados del test de velocidad.
            MAIN.setSincronizandoReportesTrue();

            var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
            misDatosCobertura = JSON.parse(misDatosCoberturaString);
    
            console.log('Mis datos de cobertura: ' + misDatosCoberturaString);
            
            //Cargamos las URL que vienen del JSON.
            //var miEvento = eventoCompleto.dameEvento(evento.configuracionEvento);
            uploadURL = MAIN.urlWS + "/testVelocidadSubida"; //miEvento.urlSubidaServidor1 //Configurar URL
            uploadURL2 = MAIN.urlWS + "/testVelocidadSubida"; //miEvento.urlSubidaServidor2; //Configurar URL
            testFilesArsis[0] = "https://d.itsoft.es/aragon/filedownload1.txt"; //miEvento.urlDescargaFichero1Servidor1; //Configurar URL
            //testFilesArsis[1] = "https://d.itsoft.es/aragon/filedownload2.txt"; //miEvento.urlDescargaFichero2Servidor1; //Configurar URL
            //testFilesArsis[2] = "https://d.itsoft.es/aragon/filedownload3.txt"; //miEvento.urlDescargaFichero3Servidor1; //Configurar URL
            testFilesOne[0] = "https://d.itsoft.es/aragon/filedownload1.txt"; //miEvento.urlDescargaFichero1Servidor2; //Configurar URL
            //testFilesOne[1] = "https://d.itsoft.es/aragon/filedownload2.txt"; //miEvento.urlDescargaFichero2Servidor2; //Configurar URL
            //testFilesOne[2] = "https://d.itsoft.es/aragon/filedownload3.txt"; //miEvento.urlDescargaFichero3Servidor2; //Configurar URL
            
            //Cargamos el multiplicador de subida:
            miMultiplicadorSubida = 1; //miEvento.multiplicadorSubida;
            
            //Para comprobar que las URLs vienen bien.
            console.log("TEST VELOCIDAD URLs bajada servidor 1: " + testFilesArsis.toString());
            console.log("TEST VELOCIDAD URLs bajada servidor 2: " + testFilesOne.toString());
            console.log("TEST VELOCIDAD URL subida 1: " + uploadURL);
            console.log("TEST VELOCIDAD URL subida 2: " + uploadURL2);
                            
            //Titulo pantalla
            $('#id_test_velocidad_estado').text("Presione Iniciar para comenzar el test");
                
            //var descTitle = $.t("pantalla_test_velocidad.titulo_indicador_descarga");
                            
            gauge_download = new JustGage({
                id: 'id_test_velocidad_gauge_download',
                //title: descTitle,
                value : 0,
                min: 0,
                max: 1000,
                decimals: 2,
                label: 'Mbps',
                customSectors: [
                    { color : "#559CB9", lo : 0, hi : 1000 }
                ]//,
                //showInnerShadow: true,
                //shadowOpacity : 0.8,
                //shadowSize : 10
            });
                        
            //var subTitle = $.t("pantalla_test_velocidad.titulo_indicador_subida");
            gauge_upload = new JustGage({
                id: 'id_test_velocidad_gauge_upload',
                //title: subTitle,
                value : 0,
                min: 0,
                max: 500,
                decimals: 2,
                label: 'Mbps',
                customSectors: [
                    { color : "#559CB9", lo : 0, hi : 500 }
                ]//,
                //showInnerShadow: true,
                //shadowOpacity : 0.8,
                //shadowSize : 10
            });
            
            // Ponemos todos los lavel de resultado a su valor
            clear();
                        
            //console.log( "ready!" );
            $('#id_test_velocidad_loader').hide();
            //$('#id_test_velocidad_button_start').show();
    
            $('#id_test_velocidad_button_start').on(MAIN.clickEvent,function() {
                //console.log( "START TEST!" );
                $('#id_bot_detener_test_velocidad').show();
                solicitadoDetenerTest = false;
                $('#id_bot_confirmar_test_velocidad').prop('disabled', true);
                gauge_download.refresh(0);
                gauge_upload.refresh(0);
                sizeBuffDescarga = 0;
                timeBuffDescarga = 0;
                sizeBuffSubida=0;
                timeBuffSubida=0;
                velocidadMediaDescarga = 0;
                velocidadMediaSubida = 0;
                actualServer = ARSIS;
                errorArsis=0;
                contarTimeoutTestVelocidad();
                calculate();
            });

            //Botón detener test
            $("#id_bot_detener_test_velocidad").on(MAIN.clickEvent, function (){
                console.log('Boton detener test pulsado.');
                detenerTest();
            });
    
            //Botón confirmar
            $("#id_bot_confirmar_test_velocidad").on(MAIN.clickEvent, function (){
                console.log('Boton Confirmar pulsado.');
                
                guardarResultados();

                document.location="resumenDatos.html";
            });
    
            //Botón atrás
            $("#id_bot_atras_test_velocidad").on(MAIN.clickEvent, function (){
                console.log('Boton atrás pulsado.');
                volverAtras();
            });

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

                console.log('Connection type en TestVelocidad: ' + networkState);
                miTipoRed = networkState;
            }, 1000);

            //Empiezo el test nada más acceder a la pantalla.
            gauge_download.refresh(0);
            gauge_upload.refresh(0);
            sizeBuffDescarga = 0;
            timeBuffDescarga = 0;
            sizeBuffSubida=0;
            timeBuffSubida=0;
            velocidadMediaDescarga = 0;
            velocidadMediaSubida = 0;
            actualServer = ARSIS;
            errorArsis=0;
            contarTimeoutTestVelocidad();
            calculate();
        });

        //Al empezar un test de velocidad llamo a esta función para si se acaba el tiempo se de por finalizado el test.
        function contarTimeoutTestVelocidad() {
            testDetenidoPorTimeout = false;
            setTimeout(function(){
                //Si el botón de confirmar el test de velocidad no está deshabilitado en que el test ha terminado y por lo tanto aunque acabe el timeout no tendrá efecto
                if (!($("#id_bot_confirmar_test_velocidad").prop("disabled"))) {
                    console.log('El test de velocidad ya acabó antes que el timeout.');
                } else {
                    console.log('Se acabó el timeout para hacer el test.');
                    testDetenidoPorTimeout = true;
                    detenerTest();
                }
            }, MAIN.timeoutTestDeVelocidad);
        }

        function guardarResultados() {
            if (miVelocidadDescargaResultado > 0) {
                misDatosCobertura.velocidadBajada = miVelocidadDescargaResultado;
            } else {
                misDatosCobertura.velocidadBajada = null;
            }
            if (miVelocidadSubidaResultado > 0) {
                misDatosCobertura.velocidadSubida = miVelocidadSubidaResultado;
            } else {
                misDatosCobertura.velocidadSubida = null;
            }
            if (miLatenciaResultado > 0) {
                misDatosCobertura.latencia = miLatenciaResultado;
            } else {
                misDatosCobertura.latencia = null;
            }

            misDatosCobertura.tipoRed = miTipoRed;

            localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(misDatosCobertura));
            MAIN.setSincronizandoReportesFalse();
        }
    
    
    /*** CALCULOS ***/
        
        //clears, performs the download test, and updates the with the results
        function calculate() {
            // clear results
            clear();
        
            // deactivate button
            $('#id_test_velocidad_button_start').hide();
            $('#id_test_velocidad_button_volver').hide();
            $('#id_test_velocidad_button_info').hide();
            $('#id_test_velocidad_loader').show();
        
            // empezamos calculando la latencia
            setTimeout (function(){getPing();}, 1000);
        }
        
        //resets widget
        function clear() {
            var mb = "--- " + "Mbps";
            var resultDownloadDetails = "--- MB Descargados en --- seg.";
            var resultUploadDetails = "--- MB Subidos en --- seg.";
            var latencyText = "<label>Latencia</label><span>" + "---" + " ms</span>";
        
            $('#id_test_velocidad_latency').html(latencyText);
        
            $('#id_test_velocidad_result_download').html("--- Kbps");
            $('#id_test_velocidad_result_download_details').html(resultDownloadDetails);
            $('#id_test_velocidad_download_mb').html(mb);
        
            $('#id_test_velocidad_result_upload').html("--- Kbps");
            $('#id_test_velocidad_result_upload_details').html(resultUploadDetails);
            $('#id_test_velocidad_upload_mb').html(mb);
        
        
            $('#id_test_velocidad_result_download').removeClass("Error");
            $('#id_test_velocidad_result_upload').removeClass("Error");
        }
        
        //enables button and hides loading bar
        function reEnable() {
            actualServer = ARSIS;
            sizeBuffDescarga = 0;
            timeBuffDescarga = 0;
            sizeBuffSubida=0;
            timeBuffSubida=0;
            uploadTime = 0;
            velocidadMediaDescarga = 0;
            velocidadMediaSubida = 0;
            errorArsis=0;
            errorMostrado = "";
        
            //$('#id_test_velocidad_button_start').show();
            $('#id_test_velocidad_button_volver').show();
            $('#id_test_velocidad_button_info').show();
            $('#id_test_velocidad_loader').hide();
        }
        
        
    /*** TESTS ***/
        
        //** Download **//
        
        //downloads file at index i of the files array, and records time to download
        function download(i) {
            if (solicitadoDetenerTest) {
                testDetenido();
            } else {
                var timeStart, timeEnd, timeDiffSec, dlSize;
                console.log( "download("+ i +") " + actualServer);
                
                $('#id_test_velocidad_estado').text("Bajando fichero " + (i + 1) + " / " + numberDownloadTest + ".");
                // download file through ajax call
                
                var url;
                if(actualServer == ARSIS){
                    url = testFilesArsis[i]  + "?n=" + Math.random();
                }
                else{
                    url = testFilesOne[i]  + "?n=" + Math.random();
                }
                
                
                $.ajax(url, {
                    cache: false,
                    beforeSend: function(jqXHR, settings) {
                        timeStart = (new Date()).getTime();
                    },
                    timeout: MAIN.timeoutTestBajada,
                    error: function(jqXHR, textStatus, errorText) {
                        if (typeof textStatus === "undefined") {
                            textStatus = "";
                        }
                        if (typeof errorText === "undefined") {
                            errorText = "";
                        }
                        console.log( "Error: " + url + " " + errorText + "\nStatus: "+ textStatus  );
                            
                            if(actualServer == ARSIS){
                            actualServer = ONEANDONE;
                            errorArsis = 1;
                            download(i);
                            }//if
                            else{
                            actualServer = ARSIS;
                            if(errorArsis == 1){
                                clear();
                                $('#id_test_velocidad_result_download').html("n/a");
                                $('#id_test_velocidad_result_upload').html("n/a");
                                //$('#id_test_velocidad_estado').text(errorTextMio);
                                mostrarErrorTest(errorTextVelocidadDescarga);
                                //reEnable();
                                upload(0);
                            }
                            else{
                                if(velocidadMediaDescarga == 0){
                                    velocidadMediaDescarga = resultadoActualArsis.speed;
                                }
                                else{
                                    var aux = (velocidadMediaDescarga + resultadoActualArsis.speed)/2; //speedbps
                                    //solo me quedo la velocidad media si aumenta el resultado
                                    if (aux > velocidadMediaDescarga){
                                        velocidadMediaDescarga = aux;
                                    }
                            
                                    sizeBuffDescarga = sizeBuffDescarga + resultadoActualArsis.size;
                                    timeBuffDescarga = timeBuffDescarga + resultadoActualArsis.tiempo;
                                }
                            
                                gauge_download.refresh(velocidadMediaDescarga/1048576); //Mbps
                            
                                i++;
                                if (i >= numberDownloadTest) {
                                    // Una vez acaba la descarga inicio la subida
                                    displayResultsDownload();
                                    upload(0);
                                } else {
                                    download(i);
                                }
                            }//else
                        }//else
                    },//error
                    success: function(data, textStatus, jqXHR) {
                    
                        if(actualServer == ARSIS){
                            console.log( "Success! " + actualServer);
                            actualServer = ONEANDONE;
                    
                            // obtenemos el tamaño del fichero
                            dlSize = data.length *8;
                    
                            // calculate download time
                            timeEnd = (new Date()).getTime();
                            timeDiffSec = (timeEnd - timeStart) / 1000;
                            timeDiffSec = timeDiffSec - (latencia/1000);
                    
                            //calculamos la velocidad media de esta y las anteriores
                            var speed = dlSize / timeDiffSec;
                            
                            //Modificación Test Velocidad 08/05/2014: Antes de mostrar el dato de speed en el guage vamos a comprobar que es correcto y si no a corregirlo.
                            if (speed < 0) {
                                speed = 0;
                            } else if (speed > 1048576000) {
                                speed = 1048576000; //Es 1048576 por 1000 que son los Megas por segundo de velocidad máxima de bajada.
                            }
                    
                            resultadoActualArsis.speed = speed;
                            resultadoActualArsis.tiempo = timeDiffSec;
                            resultadoActualArsis.size = dlSize;
                            console.log( "Speed! " + resultadoActualArsis.speed);
                            console.log( "Tiempo! " + resultadoActualArsis.tiempo);
                            console.log( "Size! " + resultadoActualArsis.size);
                    
                            download(i);
                        }//if
                        else{
                            console.log( "Success! " + actualServer);
                            actualServer = ARSIS;
                        
                            // obtenemos el tamaño del fichero
                            dlSize = data.length *8;
                    
                            // calculate download time
                            timeEnd = (new Date()).getTime();
                            timeDiffSec = (timeEnd - timeStart) / 1000;
                            //Modificación Test Velocidad 08/05/2014: Le restamos también la latencia con la latenci de este servidor.
                            timeDiffSec = timeDiffSec - (latencia2/1000);
                            
                    
                            //calculamos la velocidad media de esta y las anteriores
                            var speed = dlSize / timeDiffSec;
                    
                            console.log( "Speed! " + speed);
                            console.log( "Tiempo! " + timeDiffSec);
                            console.log( "Size! " + dlSize);
                            
                            //Modificación Test Velocidad 08/05/2014: Antes de mostrar el dato de speed en el guage vamos a comprobar que es correcto y si no a corregirlo.
                            if (speed < 0) {
                                speed = 0;
                            } else if (speed > 1048576000) {
                                speed = 1048576000; //Es 1048576 por 1000 que son los Megas por segundo de velocidad máxima de bajada.
                            }
                    
                            if(speed > resultadoActualArsis.speed){
                                if(velocidadMediaDescarga == 0){
                                    velocidadMediaDescarga = speed;
                                }
                                else{
                                    var aux = (velocidadMediaDescarga + speed)/2; //speedbps
                                    //solo me quedo la velocidad media si aumenta el resultado
                                    if (aux > velocidadMediaDescarga){
                                        velocidadMediaDescarga = aux;
                                    }
                                }
        
                                sizeBuffDescarga = sizeBuffDescarga + dlSize;
                                timeBuffDescarga = timeBuffDescarga + timeDiffSec;
                            }
                            else{
                                if(velocidadMediaDescarga == 0){
                                    velocidadMediaDescarga = resultadoActualArsis.speed;
                                }
                                else{
                                    var aux = (velocidadMediaDescarga + resultadoActualArsis.speed)/2; //speedbps
                                    //solo me quedo la velocidad media si aumenta el resultado
                                    if (aux > velocidadMediaDescarga){
                                        velocidadMediaDescarga = aux;
                                    }
                                }
        
                                sizeBuffDescarga = sizeBuffDescarga + resultadoActualArsis.size;
                                timeBuffDescarga = timeBuffDescarga + resultadoActualArsis.tiempo;
                            }
                    
                            gauge_download.refresh(velocidadMediaDescarga/1048576); //Mbps
                    
                            i++;
                            // if the the download took less than a second, try again with a larger file (longer downloads will be more accurate)
                            //if (timeDiffSec > 1 || i >= testFiles.length) {
                            if (i >= numberDownloadTest) {
                                // Una vez acaba la descarga inicio la subida
                                displayResultsDownload();
                                upload(0);
                            } else {
                                download(i);
                            }
                    
                        }//else
                    
                    }//success
                });
            }
        }
        
        
        //** Upload **//
        
        function upload(i){
            if (solicitadoDetenerTest) {
                testDetenido();
            } else {
                var timeStart, timeEnd, timeDiffSec, dlSize;
                var fileName = uploadFile[i];
                if (platformDetector.getPlatform() === platformDetector.WINDOWS_PHONE) {
                    fileName = "www/" + fileName;
                }
        
                readFiles(fileName, onStartUpload);
            }
        }
        
        function readFiles(file, onFileRead){
            console.log("Leyendo fichero: " + file);
            $.ajax({
                    type: "GET",
                    cache: false,
                    async: true,
                    url: file,
                    timeout: 40000,
                    success: function(data, textStatus, jqXHR) {
                        onFileRead(data,0);
                    },
                    error: function(jqXHR, textStatus, errorText) {
                        console.error( "Error: " + errorText + "\nStatus: "+ textStatus  );
                        console.error( "jqrStatus: " + jqXHR.status + "\njqrStatusText: "+ jqXHR.statusText  );
                        
                        onFileRead(generarDatosAleatorios(359568), 0);
                        
                        
    //                    onFileRead(null,0);
    //                    reEnable();
                    },
                    dataType: 'text'
            });
        }
    
        function generarDatosAleatorios(longitud){
            console.log("Inicio datos aleatorios: " + new Date());
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
            for( var i=0; i < longitud; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log("Fin datos aleatorios: " + new Date());
    
            return text;
        }
        
        function onStartUpload(dataFile,i){
            if (solicitadoDetenerTest) {
                testDetenido();
            } else {
                console.log( "upload("+ i +")" );
        
                $('#id_test_velocidad_estado').text("Subiendo fichero " + (i + 1) + " / " + numberUploadTest + ".");
            
                var urlSubida;
                if(i == 0){
                    urlSubida = uploadURL;
                }
                else{
                    urlSubida = uploadURL2;
                }
            
                if(dataFile != null){
                    // upload file through ajax call
                    $.ajax({
                            type: "POST",
                            cache: false,
                            url: urlSubida,
                            data: dataFile,
                            beforeSend: function(jqXHR, settings) {
                                timeStart = (new Date()).getTime();
                            },
                            timeout: MAIN.timeoutTestBajada,
                            headers: getDefaultHeaders(),
                            success: function(data, textStatus, jqXHR) {
                                console.log( "Success uploadFile!");
                            
                                timeEnd = (new Date()).getTime();
                                timeDiffSec = (timeEnd - timeStart) / 1000;
                                //Modificación Test Velocidad 08/05/2014: Para la subida a cada servidor usamos su latencia.
                                if(i == 0) {
                                    timeDiffSec = timeDiffSec - (latencia/1000);
                                } else {
                                    timeDiffSec = timeDiffSec - (latencia2/1000);
                                }
                                uploadTime = timeDiffSec;
                            
                                console.log( "Upload time: " + uploadTime);
                            
                                var speedSubida = uploadSize / timeDiffSec;
                                
                                //Modificación Test Velocidad 08/05/2014:
                                var multiplicadorS = parseFloat(miMultiplicadorSubida);
                                speedSubida = speedSubida * multiplicadorS;
                                //Modificación Test Velocidad 08/05/2014: Antes de mostrar el dato de speedSubida en el guage vamos a comprobar que es correcto y si no a corregirlo.
                                if (speedSubida < 0) {
                                    speedSubida = 0;
                                } else if (speedSubida > 65536000) {
                                    speedSubida = 65536000; //Es [65536000 = (1048576 * 500) / 8 ]. 500 son los Megas por segundo de velocidad máxima de subida.
                                }
                            
                                if(velocidadMediaSubida == 0){
                                    velocidadMediaSubida = speedSubida;
                                }
                                else{
                                    var aux = (velocidadMediaSubida + speedSubida)/2; //speedBps
                                    //solo me quedo la velocidad media si aumenta el resultado
                                    if (aux > velocidadMediaSubida){
                                        velocidadMediaSubida=aux;
                                    }
                            
                                }
                            
                                //velocidadMediaSubida = (velocidadMediaSubida + speedSubida)/2; //speedBps
                                gauge_upload.refresh((velocidadMediaSubida*8)/1048576); //MBps
                                sizeBuffSubida = sizeBuffSubida + uploadSize;
                                timeBuffSubida = timeBuffSubida + timeDiffSec;
        
                                i++;
                                if (i >= numberUploadTest){
                                    uploadTime = timeBuffSubida;
                                    displayResultsUpload();
                                    testFinalizado();
                                } else {
                                    //console.log("A por otra subida");
                                    onStartUpload(dataFile,i);
                                }
                            },
                            error: function(jqXHR, textStatus, errorText) {
                                console.log( "Error: " + errorText + "\nStatus: "+ textStatus  );
                            
                                i++;
                                if (i >= numberUploadTest){
                                    if(uploadTime > 0 && uploadTime != null && typeof uploadTime != "undefined" ){
                                        displayResultsUpload();
                                        testFinalizado();
                                    }
                                    else{
                                        //clear();
                                        $('#id_test_velocidad_result_upload').html("n/a");
                                        //$('#id_test_velocidad_estado').text(errorTextMio);
                                        mostrarErrorTest(errorTextVelocidadSubida);
                                        reEnable();
                                        testFinalizado();
                                    }
                                } else {
                                    //console.log("A por otra subida");
                                    onStartUpload(dataFile,i);
                                }
                            },
                            dataType: 'text'
                    });//ajax
            
                }//if
                else {
                    console.log( "Error: No se pudo recuperar el fichero de persistencia");
                    clear();
                    $('#id_test_velocidad_result_upload').html("n/a");
                    //$('#id_test_velocidad_estado').text(errorTextMio);
                    mostrarErrorTest(errorTextVelocidadSubida);
                    reEnable();
                    testFinalizado();
                }//else
            }
    
        }//function onStartUpload(dataFile)

        function getDefaultHeaders() {
            return {
                "Cache-Control": "private",
                "Vary":"Accept-Encoding",
                "Server":"Microsoft-IIS/7.5",
                "X-AspNet-Version":"2.0.50727",
                "X-Powered-By":"ASP.NET",
                "Content-Type": "text/html; charset=utf-8",
                "Authorization": "Bearer SAB73SFOfxOp9t2e6GbU5A33EEBCB6277B68E7E72523F4776EB6"
            };
        }
        
        
        //** Latencia **/
        
        //Modificación Test Velocidad 08/05/2014: Incluimos otra prueba de latencia para que cada prueba de descarga de un servidor use la latencia de ese servidor.
        //La primera prueba de latencia que hacemos es para "calentar motores" no nos guardamos sus datos.
        function getPing() {
            $('#id_test_velocidad_estado').text("Calculando la latencia.");
            var client = getClient(); // xmlhttprequest object
        
            client.onreadystatechange = function() {
                if (client.readyState == 2) {
                    pingDone(); //handle ping
                    client.onreadystatechange = null; //remove handler
                }
            };
        
            client.open("HEAD", testFilesArsis[0] + "?n=" + Math.random()); //static file
            client.send();
        }
        
        function pingDone() {
            getPing1();
        }
        
        function getPing1() {
            $('#id_test_velocidad_estado').text("Calculando la latencia.");
            var client = getClient(); // xmlhttprequest object
        
            client.onreadystatechange = function() {
                if (client.readyState == 2) {
                    pingDone1(); //handle ping
                    client.onreadystatechange = null; //remove handler
                }
            };
    
            console.log("FICHERO TEST LATENCIA DESCARGA SERV 1: " + testFilesArsis[0]);
            startLatency = (new Date()).getTime();
            client.open("HEAD", testFilesArsis[0] + "?n=" + Math.random()); //static file
            client.send();
        }
        
        function pingDone1() {
            endLatency = (new Date()).getTime();
            var ms = endLatency - startLatency;
            latencia = ms;
            
            console.log("TEST VELOCIDAD latencia: " + latencia);
            
            getPing2();
        }
        
        function getPing2() {
            var client = getClient(); // xmlhttprequest object
        
            client.onreadystatechange = function() {
                if (client.readyState == 2) {
                    pingDone2(); //handle ping
                    client.onreadystatechange = null; //remove handler
                }
            };
        
            console.log("FICHERO TEST LATENCIA DESCARGA SERV 2: " + testFilesOne[0]);
            startLatency2 = (new Date()).getTime();
            client.open("HEAD", testFilesOne[0] + "?n=" + Math.random()); //static file
            client.send();
        }
        
        function pingDone2() {
            endLatency2 = (new Date()).getTime();
            var ms = endLatency2 - startLatency2;
            latencia2 = ms;
            
            console.log("TEST VELOCIDAD latencia2: " + latencia2);
            
            getPingUpload();
        }
        
        function getPingUpload() {
            var client = getClient(); // xmlhttprequest object
        
            client.onreadystatechange = function() {
                if (client.readyState == 2) {
                    pingDoneUpload(); //handle ping
                    client.onreadystatechange = null; //remove handler
                }
            };
        
            console.log("FICHERO TEST LATENCIA SUBIDA SERV 1: " + testFilesArsis[0]);
            startLatencyUpload = (new Date()).getTime();
            client.open("HEAD", testFilesArsis[0] + "?n=" + Math.random()); //static file
            client.send();
        }
        
        function pingDoneUpload() {
            endLatencyUpload = (new Date()).getTime();
            var ms = endLatencyUpload - startLatencyUpload;
            latenciaUpload = ms;
            
            console.log("TEST VELOCIDAD latenciaUpload: " + latenciaUpload);
            
            getPingUpload2();
        }
        
        function getPingUpload2() {
            var client = getClient(); // xmlhttprequest object
        
            client.onreadystatechange = function() {
                if (client.readyState == 2) {
                    pingDoneUpload2(); //handle ping
                    client.onreadystatechange = null; //remove handler
                }
            };
        
            console.log("FICHERO TEST LATENCIA SUBIDA SERV 2: " + testFilesOne[0]);
            startLatencyUpload2 = (new Date()).getTime();
            client.open("HEAD", testFilesOne[0] + "?n=" + Math.random()); //static file
            client.send();
        }
        
        function pingDoneUpload2() {
            endLatencyUpload2 = (new Date()).getTime();
            var ms = endLatencyUpload2 - startLatencyUpload2;
            latenciaUpload2 = ms;
            console.log("TEST VELOCIDAD latenciaUpload2: " + latenciaUpload2);
            displayResultsLatency();
            
            // Empezamos las descargas
            download(0);
        }
        
        function getClient() {
            if (window.XMLHttpRequest)
                return new XMLHttpRequest();
        
            if (window.ActiveXObject)
                return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        
            throw("No XMLHttpRequest Object Available.");
        }
        
        
    /*** DISPLAY RESULTS ***/
        
        //updates the widget with the results
        //dlTime is time in seconds and dlSize is size in bytes
        function displayResultsDownload() {
            var speedbps, speedKbps, speedMbps, speedText, resultText;
        
            //DOWNLOAD RESULT
            //velocidad
            speedbps = velocidadMediaDescarga;			// dl speed in bytes/second
            speedKbps = (speedbps / 1024);		// dl speed in kilobytes/second
            speedMbps = (speedKbps / 1024);		// dl speed in megabytes/second
        
            var mb = speedMbps.toFixed(2) + "Mbps";
            speedText = "Velocidad: " + speedKbps.toFixed(2) + "Kbps";
        
            //tamaño
            var sizeKB= (sizeBuffDescarga / 8)/1024;
            var sizeMB= sizeKB/1024;
        
            //resultText = "" + sizeMB.toFixed(2) + " MB Descargados en " + timeBuffDescarga.toFixed(2) + " seg.";
            resultText = "Descargado dos veces " + sizeMB.toFixed(2) + " MB. <br> Mejor tiempo: " + timeBuffDescarga.toFixed(2) + " seg.";
    
            //Modificación Test Velocidad 08/05/2014: Vamos a comprobar los datos antes de mostrarlos. Si alguno sale negativo el test se da por no válido,
            // y si algún valor se por encima del límite se pone al valor máximo.
            if (speedMbps > 1000) {
                speedMbps = 1000;
            }
            if ((speedMbps <= 0) || (sizeMB <= 0) || (timeBuffDescarga <= 0)) {
                //$('#id_test_velocidad_estado').text(errorTextMio);
                mostrarErrorTest(errorTextVelocidadDescarga);
            } else {
                //pantalla
                $('#id_test_velocidad_result_download').html(speedText);
                $('#id_test_velocidad_result_download_details').html(resultText);
                $('#id_test_velocidad_download_mb').html(mb);
                miVelocidadDescargaResultado = speedMbps;
            }
        }
        
        function displayResultsUpload() {
            var speedbps, speedKbps, speedMbps, speedText, resultText;
        
            //UPLOAD RESULT
            //velocidad
            var uploadSpeed = velocidadMediaSubida * 8 / 1024; //Kbps
            var uploadSpeedMb = uploadSpeed / 1024;
        
            var mb = uploadSpeedMb.toFixed(2) + "Mbps";
            var uploadSpeedText = "Velocidad: " +  uploadSpeed.toFixed(2) + "Kbps";
        
            //tamaño
            var sizeUploadKB = (sizeBuffSubida)/1024;
            var sizeUploadMB = sizeUploadKB / 1024;
            
            //Modificación Test Velocidad 08/05/2014: Multiplicamos los megas que se han subido por el multiplicador.
            var multiplicadorS = parseFloat(miMultiplicadorSubida);
            sizeUploadMB = sizeUploadMB * multiplicadorS;
        
            var resultUploadText = "" + sizeUploadMB.toFixed(2) + " MB Subidos en " + uploadTime.toFixed(2) + " seg.";
    
            //Modificación Test Velocidad 08/05/2014: Vamos a comprobar los datos antes de mostrarlos. Si alguno sale negativo el test se da por no válido,
            // y si algún valor se por encima del límite se pone al valor máximo.
            if (uploadSpeedMb > 500) {
                uploadSpeedMb = 500;
            }
            if ((uploadSpeedMb <= 0) || (sizeUploadMB <= 0) || (uploadTime <= 0)) {
                //$('#id_test_velocidad_estado').text(errorTextMio);
                mostrarErrorTest(errorTextVelocidadSubida);
            } else {
                //pantalla
                $('#id_test_velocidad_result_upload').html(uploadSpeedText);
                $('#id_test_velocidad_result_upload_details').html(resultUploadText);
                $('#id_test_velocidad_upload_mb').html(mb);
                miVelocidadSubidaResultado = uploadSpeedMb;
            
                if (errorMostrado === "") {
                    $('#id_test_velocidad_estado').text("Prueba finalizada.");
                } else {
                    $('#id_test_velocidad_estado').text(errorMostrado);
                }
            }
        
            // display results
            reEnable();
        }
        
        //Modificación Test Velocidad 08/05/2014: Incluimos otra prueba de latencia para que cada prueba de descarga de un servidor use la latencia de ese servidor.
        function displayResultsLatency() {
            //LATENCY RESULT
            // Me quedo con la menor de las dos latencias para pintarla, aunque sigo conservando los valores de cada una para aplicarlo a las descargas de sus respectivos servidores.
            var latenciaMinima = 0;
            if (latencia < latencia2) {
                if (latencia > 0) {
                    latenciaMinima = latencia;
                } else {
                    latenciaMinima = latencia2;
                }
            } else {
                if (latencia2 > 0) {
                    latenciaMinima = latencia2;
                } else {
                    latenciaMinima = latencia;
                }
            }
    
            var latencyText = "<label>Latencia</label><span>" + latenciaMinima + " ms</span>";
            $('#id_test_velocidad_latency').html(latencyText);
            miLatenciaResultado = latenciaMinima;
        }
    
        function mostrarErrorTest(errorMostrar) {
            let posError = errorMostrado.indexOf(errorMostrar);
            if (posError < 0) {
                if (errorMostrado === "") {
                    errorMostrado = errorMostrar;
                } else {
                    errorMostrado = errorMostrado + " " + errorMostrar;
                }
    
                $('#id_test_velocidad_estado').text(errorMostrado);
            }
        }

        function detenerTest() {
            if (testDetenidoPorTimeout) {
                $('#id_test_velocidad_estado').text("Se ha excedido el tiempo máxmimo para hacer el test. Deteniendo test.");
            } else {
                $('#id_test_velocidad_estado').text("Deteniendo test");
            }
            $('#id_test_velocidad_loader').hide();
            $('#id_bot_detener_test_velocidad').hide();
            solicitadoDetenerTest = true;
        }

        function testDetenido() {
            if (testDetenidoPorTimeout) {
                $('#id_test_velocidad_estado').text("Test detenido porque se superó el tiempo máximo para hacerlo.");
            } else {
                $('#id_test_velocidad_estado').text("Test detenido");
            }
            $('#id_test_velocidad_button_start').show();
            clear();
            reEnable();
        }

        function testFinalizado() {
            $('#id_bot_detener_test_velocidad').hide();
            $('#id_test_velocidad_button_start').show();
            $('#id_bot_confirmar_test_velocidad').prop('disabled', false);
        }
    
        function volverAtras() {
            guardarResultados();
            document.location="infoConexion.html";
        }
        
        
    }());