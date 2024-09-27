(function () {

    $(document).ready(function () {
    	$("#mainPage").css("visibility","visible");
        console.log('Página info test velocidad lista.');

        //Bloqueamos el botón físico de atrás para que no se haga un history.back.
        document.addEventListener("backbutton", function (e) {
            console.log('Boton físico de atrás pulsado.');
            e.preventDefault();
        }, false );

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
        document.addEventListener("backbutton", volverAtras, false);
    });

    function volverAtras() {
        document.location="infoConexion.html";
    }

}());