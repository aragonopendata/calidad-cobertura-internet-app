/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');
    //$('#mensaje_error_permiso_gps_bienvenida').hide();

    $("#id_bot_empezar").on(MAIN.clickEvent, function (){
        console.log('Boton Empezar pulsado.');
        if(cordova.plugins && cordova.plugins.permissions){
            var permissions = cordova.plugins.permissions;
            
            var error = function() {
                console.log("Debe aprobar todos los permisos para poder usar la aplicación.");
                permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, function( status ){
                  console.log("PASO 4");
                  if ( status.hasPermission ) {
                    console.log("Yes :D ");
                    permitirAcceso();
                  }
                  else {
                    console.warn("No :( ");
                    impedirAcceso();
                  }
                },
                function(){
                    console.log("PASO 5");
                    impedirAcceso();
                });
            };
            
            var success = function(status){
                console.log("PASO 0");
                if( !status.hasPermission ) {
                    permissions.requestPermission(
                    permissions.ACCESS_FINE_LOCATION,
                    function(status) {
                        console.log("PASO 1");
                        if( !status.hasPermission ){
                            console.log("PASO 2");
                            error()
                        } else {
                            console.log("PASO 3");
                            permitirAcceso();
                        };
                    },
                    error);
                } else {
                    console.log("PASO S");
                    permitirAcceso();
                }
            };
            
            permissions.checkPermission(permissions.ACCESS_FINE_LOCATION,success,error);
        } else {
            permitirAcceso();
        }
    });

    function permitirAcceso() {
        //$('#mensaje_error_permiso_gps_bienvenida').hide();
        //Limpiamos mis datos conexión almacenados en el local storage salvo los datos del test de velocidad.
        var misDatosCoberturaString = localStorage.getItem(MAIN.keyLocalStorageDatosCobertura);
        if (misDatosCoberturaString && (misDatosCoberturaString !== "")) {
            var datosCoberturaAux = JSON.parse(misDatosCoberturaString);
            datosCoberturaAux.timestamp = "";
            datosCoberturaAux.coordenadax = 0;
            datosCoberturaAux.coordenaday = 0;
            datosCoberturaAux.municipio = "";
            datosCoberturaAux.ine = "";
            datosCoberturaAux.modelo = "";
            datosCoberturaAux.so = "";
            datosCoberturaAux.tipoRed = "";
            datosCoberturaAux.operador = "";
            datosCoberturaAux.valorIntensidadSenial = "";
            datosCoberturaAux.rangoIntensidadSenial = -1;
            datosCoberturaAux.datosConexionLimpiados = true;
            localStorage.setItem(MAIN.keyLocalStorageDatosCobertura, JSON.stringify(datosCoberturaAux));
        }
        document.location="infoPrivacidad.html";
    }

    function impedirAcceso() {
        //$('#mensaje_error_permiso_gps_bienvenida').show();
        $("body").overhang({
            type: "error",
            message: "Por favor, conceda permiso de captura de posición GPS a la aplicación para poder usarla. Gracias.",
            closeConfirm: true
        });
    }
}
