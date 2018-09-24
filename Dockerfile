FROM node:latest
MAINTAINER Arthur Baldeck <arthur.baldeck04@gmail.com>
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
