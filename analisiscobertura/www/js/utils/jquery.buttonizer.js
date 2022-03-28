/** 
 * @module buttonizer
 * 
 * Un pequeño plugin de <a href="http://jquery.com/">jQuery</a> para crear botones
 * personalizados fácilmente.
 * 
 * <p>
 * EJEMPLO DE USO:<br/>
 * Sobre el/los elemento que se quiere convertir en botón, llamamos
 * $("#<id_boton>").buttonize(<handler>, <clase para hover>, <clase para pulsación>);
 * 
 * Todos los parámetros son opcionales.
 * 
 * @author pod
 * @version 1.5 (26/03/2014)
 * 
 * */
(function( $ ) {
	
	var START_EVENT = deviceHasTouchScreen() ?  "touchstart" : "mousedown";
	var END_EVENT = deviceHasTouchScreen() ?  "touchend touchcancel" : "mouseup";

	/**
	 * Inicializa un elemento para que se comporte como un botón.
	 * 
	 * Ésta función permite crear fácilmente un botón que funcione tanto en navegador de
	 * escritorio como en dispositivos móviles con pantalla táctil.
	 * 
	 * IMPORTANTE: Ésta función utiliza eventos para detectar el hover y el click.
	 * Se recomienda no asociar ningún handler externo para detecter la pulsación
	 * del botón.
	 * 
	 * @param {String} selector Selector de jQuery. 
	 * @param {Function} [handler] Handler para manejar el click.
	 * @param {String} [hoverClassName] Clase que se aplica al elemento al hacer hover (sólo en dispositivos no táctiles).
	 * @param {String} [pressedClassName] Clase que se aplica al elemento al pulsar, y se mantiene hasta que se suelte.
	 */
	$.fn.buttonize = function(handler, hoverClassName, pressedClassName, forceNoTouch){
		validate(handler, "function");
		validate(hoverClassName, "string");
		validate(pressedClassName, "string");

		if (typeof forceNoTouch !== "undefined" && forceNoTouch) {
			START_EVENT = "mousedown";
			END_EVENT = "mouseup";
		}

		var $botones = this;
		$botones.off().unbind();

		if(hoverClassName && !deviceHasTouchScreen()){
			$botones.hover(function(){
				$(this).addClass(hoverClassName);
			},function(){
				$(this).removeClass(hoverClassName);
			});
		}

		$botones.on(START_EVENT, function(e){	
			if(e.type === "mousedown" && e.which !== 1){
				//Botones centro o derecho: ignorar.
				return consumeEvent(e);
			}
			
			if(pressedClassName){
				$(this).addClass(pressedClassName);
			}				
			
			//Capturamos el evento de soltar en todo el documento para
			//que funcione bien al pulsar y arrastrar.
			var endEventHandled = false;
			var buttonUpListener = function onreleased(e){
				if(!endEventHandled){
					endEventHandled = true;
					
					if(pressedClassName){
						$botones.removeClass(pressedClassName);
					}				
					
					$(document).off(END_EVENT, onreleased);
					
					var $target = null;
					if(e.type === "mouseup"){
						$target = $(e.target);
					} else {
						if(e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length > 0){
							var x = e.originalEvent.changedTouches[0].pageX - window.pageXOffset;
							var y = e.originalEvent.changedTouches[0].pageY - window.pageYOffset;
							var target = document.elementFromPoint(x, y);
							
							if(target){
								$target = $(target);
							}
						}
					}
					
					if ($target !== null && ($target.is($botones) || $target.parents().is($botones))){		
						if(handler){
							setTimeout(handler, 1);
						}
						return consumeEvent(e);
					} 
				}
			};			
			$(document).on(END_EVENT, buttonUpListener);
			 
			
			return consumeEvent(e);
		});
		$botones.css(
			{
				"-webkit-touch-callout": "none",
				"-webkit-user-select": "none",
				"-khtml-user-select": "none",
				"-moz-user-select": "moz-none",
				"-ms-user-select": "none",
				"user-select": "none",
				"-webkit-tap-highlight-color": "rgba(255, 255, 255, 0)" 
			}
		);

		if (typeof forceNoTouch === "undefined" || !forceNoTouch) {
			$botones.prop("disabled", true);
		}
	};
	
	function validate(param, type){
		if(param){
			if ((typeof param) !== type) {				
				throw new Error("Buttonizer: Error de validacion: el argumento no es de tipo: " + type);
			}
		}
	}
	
	function deviceHasTouchScreen(){
		return ("ontouchstart" in window || navigator.msMaxTouchPoints);
	}
	
	function consumeEvent(e){
		//e.preventDefault();
		//e.stopPropagation();
		return true;
	}
		
}(jQuery));