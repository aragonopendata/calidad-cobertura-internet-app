'use strict';
const fs = require('fs');
const env = process.env.BUILD_ENV;
const configs = {
  DEV_ARAGON: {
    entorno:    'DEV_ARAGON',
    urlWS:      'https://desopendataei2a.aragon.es/cobertura/ws-cobertura/api',
    urlFichero: 'https://desopendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt',
    urlCob:     'https://desopendata.aragon.es/servicios/cobertura',
    urlGeo:     'https://icearagondes.aragon.es/geoserver/opendata/wms',
  },
  PRE_ARAGON: {
    entorno:    'PRE_ARAGON',
    urlWS:      'https://preopendataei2a.aragon.es/cobertura/ws-cobertura/api',
    urlFichero: 'https://preopendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt',
    urlCob:     'https://preopendata.aragon.es/servicios/cobertura',
    urlGeo:     'https://icearagondes.aragon.es/geoserver/opendata/wms',
  },
  PROD_ARAGON: {
    entorno:    'PROD_ARAGON',
    urlWS:      'https://opendataei2a.aragon.es/cobertura/ws-cobertura/api',
    urlFichero: 'https://opendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt',
    urlCob:     'https://opendata.aragon.es/servicios/cobertura',
    urlGeo:     'https://icearagon.aragon.es/geoserver/opendata/wms',
  },
};
const cfg = configs[env];
if (!cfg) { console.error('Unknown BUILD_ENV:', env); process.exit(1); }
let s = fs.readFileSync('www/js/main.js', 'utf8');
s = s.replace(/ret\.esVersionWeb\s*=\s*false/, 'ret.esVersionWeb = true');
s = s.replace(/ret\.entorno\s*=\s*"PROD_ARAGON"/, `ret.entorno = "${cfg.entorno}"`);
s = s.replace('https://opendataei2a.aragon.es/cobertura/ws-cobertura/api', cfg.urlWS);
s = s.replace('https://opendataei2a.aragon.es/cobertura/test-descarga/filedownload1.txt', cfg.urlFichero);
s = s.replace('https://opendata.aragon.es/servicios/cobertura', cfg.urlCob);
s = s.replace('https://icearagon.aragon.es/geoserver/opendata/wms', cfg.urlGeo);
fs.writeFileSync('www/js/main.js', s);
console.log('Patched main.js for', env);
