
# Apolline-Frontend in NodeJS and with InfluxDB
#### Author: Arthur Baldeck
#### State in development

### Description of the app

This frontend app will allow the user to download CSV file with data from the air quality's InfluxDB database. We are using here a MeanJS boilerplate. MEAN is the acronym of MongoDB, Express, AngularJS and NodeJS and it is a strong starting point for apps which use this base.


### Prerequisites 
Make sure you have installed all of the following prerequisites on your development machine:
* GIT: [Download & Install Git](https://git-scm.com/downloads)
* Node.js: [Download & Install Node.js](https://nodejs.org/en/download/)
* MongoDB: [Download & Install MongoDB](http://www.mongodb.org/downloads)
* Bower (Manage your frontend packages)

You can install Bower by using the following command but be sure you have installed NodeJS and npm (Node Package Manager):

```bash
$ npm install -g bower
```

### Deploy the app

#### Download the app and go to the directory:

```bash
$ git clone https://github.com/Apolline-Lille/apolline-frontend.git --config core.autocrlf=input
$ cd apolline-frontend/meanjs
```
#### Build the image:

```bash
$ docker build -t meanjs .
```
#### Run the container:

```bash
$ docker-compose up
```
This final command launch your app and finally you can go to the http://localhost:80/ in your browser to see the application.

####Once the bash show this, you can use the apolline frontend app:

```bash
meanjs      | MEAN.JS - Development Environment
meanjs      | 
meanjs      | Environment:     development
meanjs      | Server:          http://0.0.0.0:80
meanjs      | Database:        mongodb://db/mean-dev
meanjs      | App version:     0.6.0
meanjs      | MEAN.JS version: 0.6.0
```

