(function () {

    $(document).ready(function () {
        console.log('Página info test velocidad lista.');

        //Botón entendido
        $("#id_bot_entendido_info_test_velocidad").on(MAIN.clickEvent, function (){
            console.log('Boton entendido pulsado.');
            document.location="testVelocidad.html";
        });

        //Botón atrás
        $("#id_bot_atras_info_test_velocidad").on(MAIN.clickEvent, function (){
            console.log('Boton atrás pulsado.');
            volverAtras();
        });
    });

    function volverAtras() {
        document.location="infoConexion.html";
    }

}());