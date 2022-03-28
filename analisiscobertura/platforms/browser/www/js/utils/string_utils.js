MAIN.utils.stringUtils = (function() {
    var ret = {};
    
    ret.isNumberOrString = function(o){
        if (((typeof o) === "string") || ((typeof o) === "number")) {
            return true;
        }
        
        return false;
    };
    
    ret.isString = function(o){
        if ((typeof o) === "string") {
            return true;
        }
        
        return false;
    };
    
    ret.validatePrimitive = function(o){
        if (! (((typeof o) === "string") || ((typeof o) === "number") || ((typeof o) === "boolean"))) {
            throw new Error("Error de validacion: el argumento no es un numero, boolean o string: " +  o +  " es  de tipo: "+ (typeof o));
        }
        
        if(!ret.isString(o)){
            return String(o);
        } else {
            return o;
        }
    };
    
    /*
    * Funciones de manejo de fechas formato: yyyy-MM-ddThh:mm
    */

    ret.dateToIso = function (date){
        var minute = date.getMinutes();
        var hour = date.getHours();
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }

        var fecha = year + "-" +month+"-"+day+"T"+hour+":"+minute;
        return fecha;
    }

    ret.getStringHour = function (dateString){
        var fecha = dateString;
        var date = new Date(fecha);
        var minute = date.getMinutes();
        var hour = date.getHours();
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        if (minute < 10) {
            minute = "0" + minute;
        }

        return hour + " : " + minute;
    }

    ret.f1Menorf2 = function (fecha1,fecha2){
        //Modificado 18/12/2015: Ya no se usan nuestros métodos como ret.getMonth(fecha1) porque las fechas que llegan ya son de tipo date.
        //var y1 = ret.getYear(fecha1);
        //var y2 = ret.getYear(fecha2);
        var y1 = fecha1.getFullYear();
        var y2 = fecha2.getFullYear();

        if (y1 < y2) {
            return true;
        }
        else if (y1 > y2){
            return false;
        }
        else{   
            //var m1 = ret.getMonth(fecha1);
            //var m2 = ret.getMonth(fecha2);
            var m1 = fecha1.getMonth();
            var m2 = fecha2.getMonth();

            if (m1 < m2) {
                return true;
            }
            else if (m1 > m2){
                return false;
            }
            else{
                //var d1 = ret.getDay(fecha1);
                //var d2 = ret.getDay(fecha2);
                var d1 = fecha1.getDate();
                var d2 = fecha2.getDate();

                if (d1 < d2) {
                    return true;
                }
                else if (d1 > d2){
                    return false;
                }
                else{
                    //var h1 = ret.getHour(fecha1);
                    //var h2 = ret.getHour(fecha2);
                    var h1 = fecha1.getHours();
                    var h2 = fecha2.getHours();

                    if (h1 < h2) {
                        return true;
                    }
                    else if (h1 > h2){
                        return false;
                    }
                    else{
                        //var mi1 = ret.getMinute(fecha1);
                        //var mi2 = ret.getMinute(fecha2);
                        var mi1 = fecha1.getMinutes();
                        var mi2 = fecha2.getMinutes();
                        
                        if (mi1 < mi2) {
                            return true;
                        }
                        else if (mi1 > mi2){
                            return false;
                        }
                        else{
                            var s1 = fecha1.getSeconds();
                            var s2 = fecha2.getSeconds();
                            
                            if (s1 < s2) {
                                return true;
                            }
                            else if (s1 > s2){
                                return false;
                            }
                            else{
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    ret.getYear = function (dateString){
        var fecha = dateString;
        var date = new Date(fecha);
        var year = date.getFullYear();
        return year;
    }

    ret.getMonth = function (dateString){
        var fecha = dateString;
        var date = new Date(fecha);
        var month = date.getMonth();
        return month;
    }

    ret.getDay = function (dateString){
        var fecha = dateString;
        var date = new Date(fecha);
        var day = date.getDate();
        return day;
    }

    ret.getHour = function (dateString){
        var fecha = dateString;
        var date = new Date(fecha);
        var hour = date.getHours();
        return hour;
    }

    ret.getMinute = function (dateString){
        var fecha = dateString;
        var date = new Date(fecha);
        var minute = date.getMinutes();
        return minute;
    }


    /*
    **********************************************************
    */
    
    /*
    *   DD/MM/AAAA HH:MM:SS
    */
    ret.parseDate_ddMMyyyy = function(s){
        var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        return (m) ? new Date(parseInt(m[3],10), parseInt(m[2],10)-1, parseInt(m[1],10)) : null;
    };
    
    ret.dateToString_ddMMyyyy = function(d){
        if(Object.prototype.toString.call(d) !== "[object Date]"){
            throw new Error("El argumento no es de tipo date: " + (typeof d));
        }
        
        var day = d.getDate();
        var month = d.getMonth() + 1; 
        var year = d.getFullYear();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        
        return day + "/" + month + "/" + year;
    };

    ret.parseDate_ddMMyyyy_hhmmss = function(s){
        //console.log("String de la fecha: " + s);
        var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s(\d{1,2})\:(\d{1,2})\:(\d{1,2})$/);
        //console.log("Match m: " + m);
        return (m) ? new Date(parseInt(m[3],10), parseInt(m[2],10)-1, parseInt(m[1],10), parseInt(m[4],10), parseInt(m[5],10), parseInt(m[6],10)) : null;
    };

    ret.parseDate_ddMMyyyy_hhmm = function(s){
        //console.log("String de la fecha: " + s);
        var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s(\d{1,2})\:(\d{1,2})$/);
        //console.log("Match m: " + m);
        return (m) ? new Date(parseInt(m[3],10), parseInt(m[2],10)-1, parseInt(m[1],10), parseInt(m[4],10), parseInt(m[5],10)) : null;
    };

    ret.dateToString_ddMMyyyy_hhmm = function(d){
        if(Object.prototype.toString.call(d) !== "[object Date]"){
            throw new Error("El argumento no es de tipo date: " + (typeof d));
        }
        
        var day = d.getDate();
        var month = d.getMonth() + 1; 
        var year = d.getFullYear();
        var minute = d.getMinutes();
        var hour = d.getHours();
        var second = d.getSeconds();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }

        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    };

    ret.dateToString_yyyyMMddhhmm = function(d){
        if(Object.prototype.toString.call(d) !== "[object Date]"){
            throw new Error("El argumento no es de tipo date: " + (typeof d));
        }
        
        var day = d.getDate();
        var month = d.getMonth() + 1; 
        var year = d.getFullYear();
        var minute = d.getMinutes();
        var hour = d.getHours();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }

        return year + "" + month + "" + day + "" + hour + "" + minute;
    };

    
    ret.dateToString_yyyyMMddhhmm_UTC = function(d){
        if(Object.prototype.toString.call(d) !== "[object Date]"){
            throw new Error("El argumento no es de tipo date: " + (typeof d));
        }
        
        var day = d.getUTCDate();
        var month = d.getUTCMonth() + 1; 
        var year = d.getUTCFullYear();
        var seconds = d.getUTCSeconds();
        var minute = d.getUTCMinutes();
        var hour = d.getUTCHours();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + "Z";
    };
    
    ret.parseBoolean = function(value){
        var sVal = "" + value;
        var intValue = parseInt(sVal, 10);
        
        if(!isNaN(intValue)){
            return (intValue > 0);
        }
        
        return (sVal.length > 0 && sVal.toLowerCase() === "true");
    };
    
    ret.parseInteger = function(value){
        return parseInt("" + value, 10);
    };
    
    ret.removeWhitespace = function(value){
    	return (("" + value).replace(/\s+/g, ""));
    };
    
    ret.endsWith = function(s, suffix) {
        return s.indexOf(suffix, s.length - suffix.length) !== -1;
    };
        

    return ret;

}());