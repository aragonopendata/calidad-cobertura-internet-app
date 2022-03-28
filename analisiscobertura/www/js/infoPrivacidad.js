(function () {

    $(document).ready(function () {
        console.log('Página info privacidad lista.');
        
        //Botón más información
        $("#id_bot_mas_informacion_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton más información pulsado.');
            window.open("https://opendata.aragon.es/informacion/terminos-de-uso-licencias", "_blank");
        });

        //Botón aceptar
        $("#id_bot_acepto_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton acepto pulsado.');
            document.location="infoConexion.html";
        });

        //Botón atrás
        $("#id_bot_atras_info_privacidad").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
    });

    function volverAtras() {
        document.location="index.html";
    }

}());