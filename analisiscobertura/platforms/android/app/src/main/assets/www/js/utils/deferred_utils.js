MAIN.utils.deferredUtils = (function() {
    var ret = {};
    
    /**
     * Notifica al deferred cuando el promise es resuelto.
     * @param promise Promise
     * @param deferred Deferred que será notificado.
     */
    ret.notify = function(promise, deferred) {
		promise.then(function(data) {
			deferred.resolve(data);
		}, function(error) {
			deferred.reject(error);
		});
	};
	
	/**
	 * Equivalente a $.when pero sin evaluación perezosa, es decir, espera a que todos
	 * los promises se hayan ejecutado antes de devolver el promise global.
	 * No pasa parámetros en el resolve ni errores en el reject.
	 * @param {Array} arrayPromises Array de Promise.
	 * @returns {Promise}
	 */
	ret.whenNonLazy = function(arrayPromises){
		var def = $.Deferred();
		
		var i = 0;
		var promiseWrappers = [];
		
		for(i = 0; arrayPromises && (i < arrayPromises.length); i++){
			promiseWrappers.push(promiseFinished(arrayPromises[i]));
		}
		
		$.when.apply($, promiseWrappers).then(
			function(){
				for(var j = 0; arrayPromises && (j < arrayPromises.length); j++){
					if(arrayPromises[j].state() === "rejected"){
						def.reject();
						return;
					}
				}
				
				def.resolve();
			}
		);
		
		return def.promise();
	};
      
	function promiseFinished(promise){
		var def = $.Deferred();
		
		promise.
		done(
			function(){
				def.resolve();
			}
		).
		fail(function(){
			def.resolve();
		});
		
		return def.promise();
	}
	

//
//ret.serialize = function(arrayPromises) {
//		var masterDeferred = $.Deferred();
//
//		var onFail = function() {
//			masterDeferred.reject();
//		};
//
//		var tmpArray = arrayPromises.slice(0);
//		tmpArray.reverse();
//
//		var recursiveFunction = function rec() {
//			if (tmpArray.length > 0) {
//				(tmpArray.pop()).then(rec, onFail);
//			} else {
//				masterDeferred.resolve();
//			}
//		};
//
//		recursiveFunction();
//
//		return masterDeferred.promise();
//	};    
	
    
    /**
	 * Ejecuta una serie de promises en serie, en el orden en que aparecen en el
	 * array. IMPORTANTE: sólo funciona si a los promises pasados como parámetro
	 * no se les ha establecido un callback (then, done, fail, etc), es decir,
	 * que no hayan sido lanzados. La ejecución se detiene en el momento en que
	 * una de ellas falla.
	 * 
	 * @return Promise.
	 */
	ret.serialize = function(arrayPromises){			
		var arrayPromisesNuevo = [];
		
		
		var comienzo = $.Deferred();
		arrayPromisesNuevo.push(comienzo.promise());
		
		for(var i = 0; i < arrayPromises.length; i++){
			arrayPromisesNuevo.push(newSerialPromise(arrayPromisesNuevo[arrayPromisesNuevo.length - 1], arrayPromises[i]));
		}
		
		comienzo.resolve();
		
		return $.when.apply($, arrayPromisesNuevo);
	};
	
	function newSerialPromise(promiseOperacionAnterior, promise){
		var deferred = $.Deferred();
		
		$.when(promiseOperacionAnterior).then(
			function(){
				ret.notify(promise, deferred);
			},
			function(error){
				deferred.reject(error);
			}
		);
				
		return deferred.promise();
	}
    
    return ret;
}());