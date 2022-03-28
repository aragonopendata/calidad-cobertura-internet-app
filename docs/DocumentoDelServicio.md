# Documento del servicio

### Descripci�n general del servicio:
Aplicaci�n desarrollada en Cordova 10 para capturar datos de calidad de la conexi�n a Internet en el territorio de Arag�n.
La aplicaci�n captura la posici�n aproximada dentro de Arag�n en la que se encuentra el dispositivo y los siguientes valores significativos de la calidad de la conexi�n del dispositivo con el que se est� usando la aplicaci�n:
	- Modelo del dispositivo.
	- Sistema operativo del dispositivo.
	- Tipo de red que est� usando el dispositivo (WiFi, 3G, 4G, ...).
	- Operador de telefon�a al que est� conectado el dispositivo.
	- Intensidad de la se�al.
	- Velocidad de bajada de la conexi�n.
	- Velocidad de subida de la conexi�n.
	- Latencia de la conexi�n.
	
### Tecnolog�as:
	- Cordova 10
	- JavaScript
	- HTML
	- CSS
	- jQuery
	- jQueryMobile
	- Android Studio
	
### Componentes del servicio:
El c�digo fuente de la aplicaci�n est� desarrollado creando un proyecto de Cordova 10. El desarrollo se hace mediante HTML, CSS, Javascript, jQuery y jQuerMobile en el directorio analisiscobertura\www y el c�digo que ah� se desarrolla luego se compila usando el Cordova 10 CLI para generar las versiones para navegador web y para Android. Con un solo c�digo fuente se generan las dos versiones. Por �ltimo para acceder a funcionalidades espec�ficas de los dispositivos se usan estos plugins de Cordova 10:
	- cordova-plugin-network-information (https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-network-information/index.html)
	- cordova-plugin-geolocation (https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-geolocation/index.html)
	- cordova-plugin-android-permissions (https://www.npmjs.com/package/cordova-plugin-android-permissions)
	- cordova-plugin-signal-strength (https://github.com/petervojtek/cordova-plugin-signal-strength)
	
### Gu�a de mantenimiento:
Para poder realizar el mantenimiento del c�digo fuente de esta aplicaci�n es necesario tener instalado en el equipo los siguientes componentes:
	- Cordova 10 CLI.
	- Android Studio (m�nimo versi�n 4.1.1) junto con el SDK de Android.

### Gu�a de pruebas:
	- Navegadores Web: Usar el comando "cordova serve" en la ruta raiz del proyecto (analisiscobertura) para generar la versi�n para navegadores web. Una vez generada la versi�n, abrir en el navegador la ruta http://localhost:8000/browser/www/index.html

	- Android: Usar el comando "cordova build android" en la ruta raiz del proyecto (analisiscobertura) para generar la versi�n para Android. Una vez generada la versi�n se habr� creado un fichero APK en la ruta analisiscobertura\platforms\android\app\build\outputs\apk\debug
	
### Gu�a de despliegue:
- Navegadores Web: Usar el comando "cordova serve" en la ruta raiz del proyecto (analisiscobertura) para generar la versi�n para navegadores web. Una vez generada la versi�n desplegar el contenido de la carpeta analisiscobertura\platforms\browser\www

-Android: Usar el comando "cordova build android" en la ruta raiz del proyecto (analisiscobertura) para generar la versi�n para Android. Una vez generada la versi�n, abrir con Android Studio el proyecto Android Studio que se encuentra en la ruta analisiscobertura\platforms\android y con Android Studio firmar la aplicaci�n para generar un APK firmado que se pueda desplegar en la Play Store de Google.