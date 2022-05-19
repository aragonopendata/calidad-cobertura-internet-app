/*
 * Obtenido del fichero plugins.js de HTML5 Boilerplate.
 * http://http://html5boilerplate.com/
 */

//Avoid `console` errors in browsers that lack a console.
(function() {    
    var method;
    var noop = function() {};
    var methods = [ 'assert', 'clear', 'count', 'debug', 'dir', 'dirxml',
            'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
            'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table',
            'time', 'timeEnd', 'timeStamp', 'trace', 'warn' ];
    var length = methods.length;
    if (typeof console === "undefined"){
        console = {};
    }  

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (typeof(console[method]) != "function") {
            console[method] = noop;
        }
    }
}());