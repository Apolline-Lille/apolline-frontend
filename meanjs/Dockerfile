# Build:
# docker build -t meanjs/mean .
#
# Run:
# docker run -it meanjs/mean
#
# Compose:
# docker-compose up -d

FROM alpine:3.9 AS base
MAINTAINER MEAN.JS

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apk --no-cache update \
&& apk --no-cache add --no-cache --virtual yqq \
&& apk --update add --no-cache --virtual npm \
&& apk --update add --no-cache --virtual curl \
&& apk --update add --no-cache --virtual git \
&& apk --update add --no-cache --virtual ssh \
&& apk --update add --no-cache --virtual gcc \
&& apk --update add --no-cache --virtual build-essential \
&& apk --update add --no-cache --virtual libkrb5 \
&& apk --update add --no-cache --virtual sudo \
&& apk --update add --no-cache --virtual apt-utils \
&& apk --update add --no-cache --virtual g++ \
&& apk --update add --no-cache --virtual make \
&& apk --update add --no-cache --virtual bash \
&& apk --update add --no-cache --virtual zlib \
&& apk --update add --no-cache --virtual libpng-dev \
&& rm -fr /var/cache/apk/* /tmp/* /var/tmp/*

# Install nodejs
RUN sudo apk add --update nodejs \
 && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

WORKDIR /opt/mean.js

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/mean.js/package.json
RUN npm install
RUN npm cache clean --force

COPY . /opt/mean.js

FROM base AS dependencies

# Install MEAN.JS Prerequisites
RUN sudo npm install --unsafe-perm --quiet -g natives \
  gulp \
  bower \
  yo \ 
  mocha \
  karma-cli \
  pm2 \
  js-yaml \
  connect \
  swagger-tools \
  express \
  path \
  http \
  fs \
  zlib \
  pngquant \
  gulp-update \
  && npm cache clean --force
RUN npm update
RUN npm install
RUN mkdir -p /opt/mean.js/public/lib
WORKDIR /opt/mean.js


# Install bower packages
COPY bower.json /opt/mean.js/bower.json
COPY .bowerrc /opt/mean.js/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

# 3000 = HTTP, 443 = HTTPS, 80 = MEAN.JS server, 35729 = livereload, 8080 = node-inspector
EXPOSE 3000 443 80 35729 8080

USER root

# Run MEAN.JS server
CMD npm install && npm start