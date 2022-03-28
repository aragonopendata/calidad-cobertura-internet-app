MAIN.utils.connectivityManager = (function() {
    var ret = {};

    ret.isOnline = function() {
		return navigator.onLine;
    };
    return ret;
}());