(function () {

    $(document).ready(function () {
    	$("#mainPage").css("visibility","visible");
        console.log('Página datos enviados OK lista.');

        //Bloqueamos el botón físico de atrás para que no se haga un history.back.
        document.addEventListener("backbutton", function (e) {
            console.log('Boton físico de atrás pulsado.');
            e.preventDefault();
        }, false );

        //Borro el reporte actual del localStorage par empezar el siguiente reporte desde cero.
        localStorage.removeItem(MAIN.keyLocalStorageDatosCobertura);

        //Botón acceder a resultados
        $("#id_bot_acceder_resultados_en_aragon_open_data").on(MAIN.clickEvent, function (){
            console.log('Boton acceder a resultados pulsado.');
            window.open("https://opendata.aragon.es/servicios/cobertura", "_blank");
        });

        //Botón finalizar
        $("#id_bot_finalizar_envio_ok").on(MAIN.clickEvent, function (){
            console.log('Boton finalizar pulsado.');
            document.location="index.html";
        });
    });

}());