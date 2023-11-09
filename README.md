# App Análisis de cobertura

Aplicación desarrollada en Cordova 12 para capturar datos de calidad de la conexión a Internet en el territorio de Aragón.
La aplicación captura la posición aproximada dentro de Aragón en la que se encuentra el dispositivo y los siguientes valores significativos de la calidad de la conexión del dispositivo con el que se está usando la aplicación:
	- Modelo del dispositivo.
	- Sistema operativo del dispositivo.
	- Tipo de red que está usando el dispositivo (WiFi, 3G, 4G, ...).
	- Operador de telefonía al que está conectado el dispositivo.
	- Intensidad de la señal.
	- Velocidad de bajada de la conexión.
	- Velocidad de subida de la conexión.
	- Latencia de la conexión.
	

### Preparacion proyecto:

- Instalar Cordova 12 CLI.
- Instalar mínimo Android Studio Android Studio Chipmunk | 2021.2.1 junto con el SDK de Android.

### Tests
- Navegadores Web: Usar el comando "cordova serve" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para navegadores web. Una vez generada la versión abrir en el navegador la ruta http://localhost:8000/browser/www/index.html

- Android: Usar el comando "cordova build android" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para Android. Una vez generada la versión se habrá creado un fichero APK en la ruta analisiscobertura\platforms\android\app\build\outputs\apk\debug

### Despliegue
- Navegadores Web: Usar el comando "cordova serve" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para navegadores web. Una vez generada la versión desplegar el contenido de la carpeta analisiscobertura\platforms\browser\www

- Android: Usar el comando "cordova build android" en la ruta raiz del proyecto (analisiscobertura) para generar la versión para Android. Una vez generada la versión, abrir con Android Studio el proyecto Android Studio que se encuentra en la ruta analisiscobertura\platforms\android y con Android Studio firmar la aplicación para generar un APK firmado que se pueda desplegar en la Play Store de Google.
