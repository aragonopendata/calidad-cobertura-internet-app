MAIN.utils.domUtils = (function() {
    var ret = {};
    
    /**
	 * Carga un fragmento de HTML de la página especificada.
	 * Se devolverá el primer elemento en la página especificada que tenga un atributo
	 * con el nombre y el valor pasados por parámetro.
	 * 
	 * @param urlPagina String. URL de la página de donde se extraerá el fragmento. Debe ser HTML bien formado.
	 * @param nombreAtributo String. Nombre del atributo selector.
	 * @param valorAtributo String. Valor del atributo selector.
	 * @returns Promise. Al callback de éxito se le pasael elemento.
	 */
	ret.cargaFragmento = function(urlPagina, nombreAtributo, valorAtributo){
		var def = $.Deferred();
        
        var div = document.createElement("div");
        var $div = $(div);        
        
        $div.load(urlPagina + " [" + nombreAtributo + "=" + valorAtributo + "]", function(){
            var fragmento = ret.extraeContenido(div);
            def.resolve(fragmento);
        });        
        
        return def.promise();
	};
	
	/**
	 * Extrae el contenido de un div.
	 * @param div El div cuyo contenido se quiere extraer.
	 * @returns Contenido del div pasado por parámetro.
	 */
	ret.extraeContenido = function(div){
        var loadedContent = $(div).html();        
        return loadedContent;
    };
    
    /**
     * Añade el contenido pasado como parámetro al elemento.
     * @param $element Elemento al que se se añadirá el contenido.
     * @param child Contenido a añadir.
     */
    ret.addInside = function($element, child){
        if($element && $element.length > 0){
            $element.append(child);
        }
    };
    
    return ret;
}());