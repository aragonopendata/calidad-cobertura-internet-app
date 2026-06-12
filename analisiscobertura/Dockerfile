# Stage 1 — build
FROM node:20 AS build

ARG BUILD_ENV=PROD_ARAGON
ENV BUILD_ENV=${BUILD_ENV}

WORKDIR /app

RUN npm install -g cordova@12

COPY . .

RUN npm install

RUN cordova platform add browser

# patch-main.js is a separate file instead of an inline heredoc because the
# server runs Docker 20.10.5, which does not support Dockerfile heredoc syntax
RUN node patch-main.js

RUN gunzip www/test-descarga/filedownload1.txt.gz

RUN cordova build browser

# Stage 2 — serve
FROM nginx:alpine

COPY --from=build /app/platforms/browser/www /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1
