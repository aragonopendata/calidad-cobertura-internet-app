# Documento del servicio

### Descripción general del servicio:
Aplicación desarrollada en Cordova 10 para capturar datos de calidad de la conexión a Internet en el territorio de Aragón.
La aplicación captura la posición aproximada dentro de Aragón en la que se encuentra el dispositivo y los siguientes valores significativos de la calidad de la conexión del dispositivo con el que se está usando la aplicación:
	- Modelo del dispositivo.
	- Sistema operativo del dispositivo.
	- Tipo de red que está usando el dispositivo (WiFi, 3G, 4G, ...).
	- Operador de telefonía al que está conectado el dispositivo.
	- Intensidad de la señal.
	- Velocidad de bajada de la conexión.
	- Velocidad de subida de la conexión.
	- Latencia de la conexión.
	
### Tecnologías:
	- Cordova 10
	- JavaScript
	- HTML
	- CSS
	- jQuery
	- jQueryMobile
	- Android Studio
	
### Componentes del servicio:
El código fuente de la aplicación está desarrollado creando un proyecto de Cordova 10. El desarrollo se hace mediante HTML, CSS, Javascript, jQuery y jQuerMobile en el directorio analisiscobertura\www y el código que ahí se desarrolla luego se compila usando el Cordova 10 CLI para generar las versiones para navegador web y para Android. Con un solo código fuente se generan las dos versiones. Por último para acceder a funcionalidades específicas de los dispositivos se usan estos plugins de Cordova 10:
	- cordova-plugin-network-information (https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-network-information/index.html)
	- cordova-plugin-geolocation (https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-geolocation/index.html)
	- cordova-plugin-android-permissions (https://www.npmjs.com/package/cordova-plugin-android-permissions)
	- cordova-plugin-signal-strength (https://github.com/petervojtek/cordova-plugin-signal-strength)
	
### Guía de mantenimiento:
Para poder realizar el mantenimiento del código fuente de esta aplicación es necesario tener instalado en el equipo los siguientes componentes:
	- Cordova 10 CLI.
	- Android Studio (mínimo versión 4.1.1) junto con el SDK de Android.

### Guía de pruebas:
	- Navegadores Web: Usar el comando "cordova serve" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para navegadores web. Una vez generada la versión, abrir en el navegador la ruta http://localhost:8000/browser/www/index.html

	- Android: Usar el comando "cordova build android" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para Android. Una vez generada la versión se habrá creado un fichero APK en la ruta analisiscobertura\platforms\android\app\build\outputs\apk\debug
	
### Guía de despliegue:
- Navegadores Web: Usar el comando "cordova serve" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para navegadores web. Una vez generada la versión desplegar el contenido de la carpeta analisiscobertura\platforms\browser\www

-Android: Usar el comando "cordova build android" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para Android. Una vez generada la versión, abrir con Android Studio el proyecto Android Studio que se encuentra en la ruta analisiscobertura\platforms\android y con Android Studio firmar la aplicación para generar un APK firmado que se pueda desplegar en la Play Store de Google.