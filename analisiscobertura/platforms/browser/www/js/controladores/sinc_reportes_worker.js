var i = 0;

function timedCount() {
    i = i + 1;
    console.log('Ejecutando web woorker: ' + i);
    postMessage(i);
    setTimeout("timedCount()",30000);
}

timedCount(); 