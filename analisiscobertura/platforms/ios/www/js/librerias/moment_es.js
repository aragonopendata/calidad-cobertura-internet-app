// moment.js language configuration
// language : spanish (es)
// author : Julio Napurí : https://github.com/julionc

if(moment){
	moment.lang('es', {
	    months : "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
	    monthsShort : "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
	    weekdays : "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
	    weekdaysShort : "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
	    weekdaysMin : "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D [de] MMMM [de] YYYY",
	        LLL : "D [de] MMMM [de] YYYY LT",
	        LLLL : "dddd, D [de] MMMM [de] YYYY LT"
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "en %s",
	        past : "hace %s",
	        s : "unos segundos",
	        m : "un minuto",
	        mm : "%d minutos",
	        h : "una hora",
	        hh : "%d horas",
	        d : "un día",
	        dd : "%d días",
	        M : "un mes",
	        MM : "%d meses",
	        y : "un año",
	        yy : "%d años"
	    },
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});
} else {
	console.error("moment.js no está cargado");
}