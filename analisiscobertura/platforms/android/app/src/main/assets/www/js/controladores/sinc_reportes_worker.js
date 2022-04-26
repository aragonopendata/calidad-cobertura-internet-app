var i = 0;

function timedCount() {
  i = i + 1;
  console.log('Ejecutando web woorker: ' + i);
  setTimeout("timedCount()",2000);
}

timedCount(); 