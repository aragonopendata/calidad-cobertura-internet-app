(function () {

    $(document).ready(function () {
        console.log('Página datos enviados OK lista.');

        //Botón finalizar
        $("#id_bot_finalizar_envio_ok").on(MAIN.clickEvent, function (){
            console.log('Boton finalizar pulsado.');
            document.location="index.html";
        });
    });

}());