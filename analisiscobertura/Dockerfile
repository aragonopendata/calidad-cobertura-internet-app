# Stage 1 — build
FROM node:20 AS build

ARG BUILD_ENV=PROD_ARAGON
ENV BUILD_ENV=${BUILD_ENV}

WORKDIR /app

RUN npm install -g cordova@12

COPY . .

RUN npm install

RUN cordova platform add browser

RUN node - <<'EOF'
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
EOF

RUN cordova build browser

# Stage 2 — serve
FROM nginx:alpine

COPY --from=build /app/platforms/browser/www /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1
