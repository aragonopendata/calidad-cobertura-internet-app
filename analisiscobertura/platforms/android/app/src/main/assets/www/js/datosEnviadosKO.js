(function () {

    $(document).ready(function () {
        console.log('Página datos enviados KO lista.');

        //Botón finalizar
        $("#id_bot_finalizar_envio_ko").on(MAIN.clickEvent, function (){
            console.log('Boton finalizar pulsado.');
            document.location="index.html";
        });
    });

}());