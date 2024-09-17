MAIN.ws = (function(){
    var ret = {};
    
    /*
    var urlWS = "";

    if (MAIN.entorno === "DEV") {
        urlWS = "https://wsdevcobertura.itsoft.es/api";
    }
    if (MAIN.entorno === "DEV_ARAGON") {
        urlWS = "https://desopendataei2a.aragon.es/cobertura/api/api";
    }
    if (MAIN.entorno === "PRE_ARAGON") {
        urlWS = "https://preopendataei2a.aragon.es/cobertura/api/api/";
    }
    if (MAIN.entorno === "PROD_ARAGON") {
        //urlWS = "https://miv-aodei2a-01.aragon.local:4000/api";
        urlWS = "https://miv-aodei2a-01.aragon.local:4000/ws-cobertura/api";
    }
    */

    /*SERVICIOS WEB*/
    var postObtenerMunicipioPorCoordenadas = "/obtenerMunicipioPorCoordenadas";
    var postObtenerDatosPorCoordenadas = "/obtenerDatosPorCoordenadas";
    var postObtenerCoordenadasPorMunicipio = "/obtenerCoordenadasPorMunicipio";
    var postRegistrarDatosCobertura = "/registrarDatosCobertura";
    var postObtenerCalidadCobertura = "/obtenerCalidadCobertura";

    /* CODIGOS SERVIDOR */
    ret.OK = 1;
    ret.ERROR_CONTROLADO = 0;
    ret.ERROR_AUTENTICACION = -2;
    ret.ERROR_CONECTIVIDAD = -997;
    ret.ERROR_TIMEOUT = -998;
    ret.ERROR_CONEXION = -999;

    ret.obtenerDatosPorCoordenadas = function(latitud, longitud, so,modelo, tipoRed) {

        var def = $.Deferred();

        //Convierto la latitud y la longitud a String:
        var latTexto = latitud.toString();
        var lonTexto = longitud.toString();

        //console.log("obtenerMunicipioPorCoordenadas: Latitud: " + latTexto + " Longitud: " + lonTexto);

        var request = {'latitud': latTexto, 'longitud': lonTexto, 'sSO': so, 'sModelo': modelo, 'sTipoRed': tipoRed};
        $.when( postJSON(request, MAIN.urlWS + postObtenerDatosPorCoordenadas, getDefaultHeaders(), WSResponse) )
        .then(function (wsResponse){
            //alert("wsResponse login: " + wsResponse);
            def.resolve(wsResponse);
            })
        .fail(function (wsError){
            //alert("wsError login: " + wsError);
            def.reject(wsError)
        });

        return def.promise();
    };

    ret.obtenerMunicipioPorCoordenadas = function(latitud, longitud) {

        var def = $.Deferred();

        //Convierto la latitud y la longitud a String:
        var latTexto = latitud.toString();
        var lonTexto = longitud.toString();

        //console.log("obtenerMunicipioPorCoordenadas: Latitud: " + latTexto + " Longitud: " + lonTexto);

        var request = {'latitud': latTexto, 'longitud': lonTexto};
        $.when( postJSON(request, MAIN.urlWS + postObtenerMunicipioPorCoordenadas, getDefaultHeaders(), WSResponse) )
        .then(function (wsResponse){
            //alert("wsResponse login: " + wsResponse);
            def.resolve(wsResponse);
            })
        .fail(function (wsError){
            //alert("wsError login: " + wsError);
            def.reject(wsError)
        });

        return def.promise();
    };

    ret.registrarDatosCobertura = function(datosCobertura) {

        var def = $.Deferred();

        $.when( postJSON(datosCobertura, MAIN.urlWS + postRegistrarDatosCobertura, getDefaultHeaders(), WSResponse) )
        .then(function (wsResponse){
            //alert("wsResponse login: " + wsResponse);
            def.resolve(wsResponse);
            })
        .fail(function (wsError){
            //alert("wsError login: " + wsError);
            def.reject(wsError)
        });

        return def.promise();
    };

    ret.obtenerCalidadCobertura = function(velBajada, categoria) {

        var def = $.Deferred();

  

        //console.log("obtenerMunicipioPorCoordenadas: Latitud: " + latTexto + " Longitud: " + lonTexto);

        $.when( post( MAIN.urlWS + postObtenerCalidadCobertura+"?categoria="+categoria+"&velBajada="+velBajada, getDefaultHeaders(), WSResponse) )
        .then(function (wsResponse){
            //alert("wsResponse login: " + wsResponse);
            def.resolve(wsResponse);
            })
        .fail(function (wsError){
            //alert("wsError login: " + wsError);
            def.reject(wsError)
        });

        return def.promise();
    };
    /*************************/
    /*    METODOS PRIVADOS   */ 
    /*************************/
    
    function postJSON(dataToSend, url, headers, responseConstructor, password) {
        //console.log("**** WS ("+url+")> " + JSON.stringify(dataToSend));
        
        var def = $.Deferred();

        var respConstructor = responseConstructor;
        if(!respConstructor){
            respConstructor = WSResponse;
        }
        
        if(MAIN.utils.connectivityManager.isOnline()) {

            var success = function(data, textStatus, jqXHR){
                //console.log("**** WS OK < " + JSON.stringify(data));
                //console.log("Status: " + jqXHR.status + " Error: " + jqXHR.statusText + " Data: "+ JSON.stringify(jqXHR));
                var response = new respConstructor(jqXHR.status, jqXHR.statusText, JSON.parse(data), jqXHR.getResponseHeader("content-type") || "");
                if(response.ok()){
                    //console.log("WS < " + response.toString());
                } else {
                    //console.error("WS < " + response.toString());
                }
                def.resolve(response);
                //callback(response);
            };

            var error = function(jqXHR, textStatus, errorThrown) {
                //console.error("**** WS error < " + JSON.stringify(jqXHR));
                //console.log("Status: " + jqXHR.status + " Error: " + errorThrown + " Data: "+ JSON.stringify(jqXHR));
                var response = new respConstructor(jqXHR.status, jqXHR.statusText, jqXHR.responseText, jqXHR.getResponseHeader("content-type") || "");
                if(response.ok()){
                    //console.log("WS < " + response.toString());
                } else {
                    //console.error("WS < " + response.toString());
                }
                def.reject(response);
                //callback(response);
            }

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(dataToSend),
                success: success,
                error: error,
                timeout:20000,
                headers: (headers ? headers : getDefaultHeaders()),

            });

        } else {
            var response = new respConstructor(ret.ERROR_CONECTIVIDAD, "No hay conectividad", null, null);
            response.getResponseType = function(){
                return ret.ERROR_CONECTIVIDAD;
                //def.reject(ret.ERROR_CONECTIVIDAD);
            };
            def.reject(response);
        }  

        return def.promise();
    }
    
    function post( url, headers, responseConstructor, password) {
        //console.log("**** WS ("+url+")> " + JSON.stringify(dataToSend));
        
        var def = $.Deferred();

        var respConstructor = responseConstructor;
        if(!respConstructor){
            respConstructor = WSResponse;
        }
        
        if(MAIN.utils.connectivityManager.isOnline()) {

            var success = function(data, textStatus, jqXHR){
                //console.log("**** WS OK < " + JSON.stringify(data));
                //console.log("Status: " + jqXHR.status + " Error: " + jqXHR.statusText + " Data: "+ JSON.stringify(jqXHR));
                var response = new respConstructor(jqXHR.status, jqXHR.statusText, data, jqXHR.getResponseHeader("content-type") || "");
                if(response.ok()){
                    //console.log("WS < " + response.toString());
                } else {
                    //console.error("WS < " + response.toString());
                }
                def.resolve(response);
                //callback(response);
            };

            var error = function(jqXHR, textStatus, errorThrown) {
                //console.error("**** WS error < " + JSON.stringify(jqXHR));
                //console.log("Status: " + jqXHR.status + " Error: " + errorThrown + " Data: "+ JSON.stringify(jqXHR));
                var response = new respConstructor(jqXHR.status, jqXHR.statusText, jqXHR.responseText, jqXHR.getResponseHeader("content-type") || "");
                if(response.ok()){
                    //console.log("WS < " + response.toString());
                } else {
                    //console.error("WS < " + response.toString());
                }
                def.reject(response);
                //callback(response);
            }

            $.ajax({
                type: "POST",
                url: url,
                success: success,
                error: error,
                timeout:20000,
                headers: (headers ? headers : getDefaultHeaders()),

            });

        } else {
            var response = new respConstructor(ret.ERROR_CONECTIVIDAD, "No hay conectividad", null, null);
            response.getResponseType = function(){
                return ret.ERROR_CONECTIVIDAD;
                //def.reject(ret.ERROR_CONECTIVIDAD);
            };
            def.reject(response);
        }  

        return def.promise();
    }
    function getDefaultHeaders() {
        return {
            "Cache-Control": "private",
            "Content-Encoding":"gzip",
            "Vary":"Accept-Encoding",
            "Server":"Microsoft-IIS/7.5",
            "X-AspNet-Version":"2.0.50727",
            "X-Powered-By":"ASP.NET",
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer SAB73SFOfxOp9t2e6GbU5A33EEBCB6277B68E7E72523F4776EB6"
        };
    }
    
    function WSResponse(codHttp, descErr, datosRecibidos, contentType) {
        var responseCode = MAIN.utils.stringUtils.parseInteger(codHttp);

        //"**** WS error < {"readyState":0,"status":0,"statusText":"timeout"}"
        var datos;
        datos = datosRecibidos;

        var responseMessage = datos ? datos.mensajeRespuesta : descErr;
        var type = contentType;

        //console.log("Respuesta del servicio web: codHttp " + responseCode + " responseMessage: " + responseMessage + " contentType: " + type);
        
        var exports = {};

        exports.toString = function(){
            return "code: " + responseCode + "; message: " + responseMessage + "; data: \n\t" + JSON.stringify(datos);
        };

        exports.ok = function(){

            if(200 === responseCode){

                if(datos && datos.estadoRespuesta == ret.OK){
                    return true;
                }
                else if(responseMessage == "timeout"){
                    return false;
                }
            }
            
            return false;
        };

        exports.getResponseMessage = function() {
            return responseMessage;
        };

        exports.getResponseType = function() {

            if(this.ok()){

                return ret.OK;
            } 
            else if (responseMessage == "timeout"){
                return ret.ERROR_TIMEOUT;
            }
            else if(200 === responseCode){

                //Normalmente el servidor siempre devolvera codigo 200 y en res vendra el codigo del error o exito
                return datos.estadoRespuesta;

            } 
            else if(401 === responseCode || 403 === responseCode) {
                return ret.ERROR_AUTENTICACION;
            }
            else if(-999 === responseCode){
                return ret.ERROR_CONEXION;
            }
            else {
                return ret.ERROR_CONTROLADO;
            }
        };

        exports.getContent = function() {
            return datos;
        };
        
        exports.getContentType = function(){
            return type;
        };
        
        return exports;
    }

    return ret;    
})();