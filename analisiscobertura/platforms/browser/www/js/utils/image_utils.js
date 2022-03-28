MAIN.utils.imageUtils = (function() {
	var ret = {};
	
	var platformDetector = MAIN.utils.platformDetector;

	/**
	 * Descarga una imagen de la url pasada como parámetro, y devuelve
	 * una URI de tipo data con el contenido de la imagen en base64.
	 * El formato de las imágenes es PNG, y la densidad es 96dpi.
	 * 
	 * @param imageURL String. URL de la imagen a descargar.
	 * @param successCallback Funcion. Se invoca si va bien, y recibe como parámetro el string con el URI de tipo data.
	 * @param errorCallback Funcion. Se llama si hay error.
	 */
	ret.urlToPNGDataUri = function(imageURL, successCallback, errorCallback) {		
		if ((typeof imageURL) !== "string") {
			throw new Error("Error de validacion: el argumento no es un string.");
		}

		if (imageURL === "") {
			if (errorCallback) {
				errorCallback();
				return;
			}
		}

		var img = new Image();
		img.setAttribute('crossOrigin','anonymous');
		img.src = imageURL;
		img.onload = function() {
			var error = false;
			var dataURL = null;
			var canvas = null;
			var ctx = null;

			try {				
				canvas = document.createElement("canvas");				
				canvas.width = this.width;
				canvas.height = this.height;

				ctx = canvas.getContext("2d");				
				ctx.drawImage(this, 0, 0);				
				canvas.setAttribute('crossOrigin','anonymous');				
				dataURL = canvas.toDataURL("image/png");				

				if (!dataURL || dataURL.length <= 0) {
					error = true;
				}
			} catch (exc) {
				console.error("Excepción al convertir imagen a base64");
				error = true;
			} finally {
				if (img && img.parentNode) {
					img.parentNode.removeChild(img);
				}
				if (canvas && canvas.parentNode) {
					canvas.parentNode.removeChild(canvas);
				}
			}

			if (!error) {
				if (successCallback) {
					successCallback(dataURL);
				}
			} else {
				if (errorCallback) {
					errorCallback();
				}
			}

			dataURL = null;
			canvas = null;
			ctx = null;
		};

		img.onerror = errorCallback;
	};

	/**
	 * Guarda una imagen remota en un directorio local con el nombre especificado.
	 * Este directorio se crea a su vez dentro del directorio que phonegap determine
	 * como directorio para datos de la aplicación (suele ser la raíz de la SDCard o bien
	 * un directorio privado para la aplicación).
	 * IMPORTANTE: necesita phonegap.
	 * 
	 * @param directoryName String. Nombre de la carpeta temporal (sin path)
	 * @param fileName String. Nombre del fichero imagen a crear (sin path)
	 * @param remoteImageURL String. URL completa de la imagen remota.
	 * @param successCallback Funcion. Callback que se ejecuta si todo fue bien.
	 * @param errorCallback Funcion. Callback que se ejecuta si hubo algun error.
	 */
	ret.saveImageToPersistentDirectory = function(directoryName, fileName, remoteImageURL, successCallback, errorCallback) {
		var onError = function(err) {
			console.error("Error al guardar imagen en cache: " + JSON.stringify(err));
			errorCallback();
		};
		
		if(!MAIN.estaPhonegapCargado()){
			onError("Phonegap no está cargado");
			return;
		}

		try {
			requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				try {
					var rootDirectoryEntry = fileSystem.root;

					console.log("Detectado sistema de ficheros en: " + rootDirectoryEntry.fullPath);

					// Obtenemos o creamos el directorio de la aplicación
					rootDirectoryEntry.getDirectory(directoryName, {
						create : true,
						exclusive : false
					}, function(cacheDirectoryEntry) {
						try {
							console.log("Abierto directorio: " + cacheDirectoryEntry.fullPath);

							// Creamos o abrimos el fichero					
							cacheDirectoryEntry.getFile(fileName, {
								create : true,
								exclusive : false
							}, function(fileEntry) {
								try {
									new FileTransfer().download(remoteImageURL, fileEntry.toURL(), function(imageFileEntry) {
										try {
											console.log("Imagen guardada en: " + imageFileEntry.toURL());
											successCallback(imageFileEntry.toURL());
										} catch (exec5) {
											console.log("Excepción en imageFileEntry.toURL()");
											onError(exec5);
										} 
									}, onError, true, {
										headers : {}
									});
								} catch (exec4) {
									console.log("Excepción en FileTransfer");
									onError(exec4);
								}
							}, onError);
						} catch (exec3) {
							console.log("Excepción en getFile");
							onError(exec3);
						}
					}, onError);
				} catch (exec2) {
					console.log("Excepción en getDirectory");
					onError(exec2);
				}
			}, onError);
		} catch (exec1) {
			console.log("Excepción en requestFileSystem");
			onError(exec1);
		}
	};
	
	/**
	 * Elimina una imagen del sistema de ficheros.
	 * IMPORTANTE: necesita phonegap.
	 * 
	 * @param fileAbsolutePath String. Path completo del fichero.
	 * @param successCallback Funcion. Callback que se ejecuta si todo fue bien.
	 * @param errorCallback Funcion. Callback que se ejecuta si hubo algun error.
	 */
	ret.deleteImageFromPersistentDirectory = function(fileAbsolutePath, successCallback, errorCallback){
		var onError = function(err) {
			console.error("Error al borrar imagen de cache: " + JSON.stringify(err));
			if(errorCallback){
				errorCallback();
			}
		};
		
		if(!MAIN.estaPhonegapCargado()){
			onError("Phonegap no está cargado");
			return;
		}

		getFileEntryFromAbsolutePath(fileAbsolutePath, function(fileEntry) {
			//Eliminamos el fichero
			console.log("Eliminando imagen " + fileAbsolutePath);
			fileEntry.remove(
				function(){
					console.log("Imagen " + fileAbsolutePath + " eliminada de cache");
					if(successCallback){
						successCallback();
					}					
				},
				onError
			);					
			
		}, onError);
	};
	
	/**
	 * Lee una imagen del sistema de fichero y devuelve una cadena en base64.
	 * 
	 * @param fileAbsolutePath String. Path completo del fichero.
	 * @param successCallback Funcion. Callback que se ejecuta si todo fue bien. A esta función se le pasa un string con
	 * el contenido del fichero en base64.
	 * @param errorCallback Funcion. Callback que se ejecuta si hubo algun error.
	 */
	ret.readImageToBase64 = function(fileAbsolutePath, successCallback, errorCallback){
		var onError = function(err) {
			console.error("Error al leer fichero imagen: " + JSON.stringify(err));
			errorCallback();
		};
		
		if(!MAIN.estaPhonegapCargado()){
			onError("Phonegap no está cargado");
			return;
		}
		
		getFileEntryFromAbsolutePath(fileAbsolutePath, function(fileEntry){			
			console.log("Voy a leer el file.");
			fileEntry.file(function(file){
				console.log("El file vale: " + file);
				var reader = new FileReader();
				reader.onload = function(evt) {
					console.log("Fichero imagen leído!");
					successCallback(evt.target.result);
				};
				reader.onerror = onError;
				reader.readAsDataURL(file);				
			}, onError);			
		}, onError);		
	};
	
	function getFileEntryFromAbsolutePath(fileAbsolutePath, onFileEntryFound, onError){
		console.log("Accediendo a fichero: " + fileAbsolutePath);
		try {
			resolveLocalFileSystemURI(fileAbsolutePath, onFileEntryFound, onError);
		} catch (exc) {
			console.error("Error al acceder al fichero " + fileAbsolutePath + ": " + JSON.stringify(exc));
		}
		
		/*
		if(platformDetector.getPlatform() !== platformDetector.BLACKBERRY_10){
			resolveLocalFileSystemURI(fileAbsolutePath, onFileEntryFound, onError);
		} else {
			// Dessactivamos el sandbox para poder acceder a la carpeta shared
			blackberry.io.sandbox = false;
			
			// Corregimos el path con la ruta correcta. esto es necesario porque cada aplicación
			// accede a los ficheros compartidos con una ruta específica para dicha aplicación.
			// Además hay que eliminar el protocolo "file://" del inicio de la ruta.
			var relativePath = blackberry.io.sharedFolder + fileAbsolutePath.substr(28);
			console.log("BB10: Corregido path a fichero: " + relativePath);
			
			requestFileSystem(window.PERSISTENT, 1024*1024*1024, function (fs) {
				fs.root.getFile(relativePath, {create: false, exclusive: false}, onFileEntryFound, onError);
			}, onError);
		}
		*/
	}

	/**
	 * Extrae la extensión del fichero a partir de una URI.
	 * @param ruta String. Contiene una ruta (absoluta o relativa) con el nombre del fichero.
	 * @returns {String} Extensión del fichero, o cadena vacía si la cadena de entrada no contiene el carácter punto.
	 */
	ret.extraerExtension = function(ruta) {
		var ret = "";

		if (ruta && ruta.length > 0) {
			var index = ruta.lastIndexOf(".");
			if (index >= 0 && ((index + 1) < ruta.length)) {
				ret = ruta.substr(index + 1);
			}
		}

		return ret;
	};

	return ret;
}());